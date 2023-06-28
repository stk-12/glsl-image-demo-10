import '../css/style.scss'
import * as THREE from "three";
import { gsap, Power2 } from 'gsap';
import Figure from './figure';

import Swiper, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.imgPlaneArray = [];

    this.sliderState = '';

    this.init();

    this._slider();

  }

  _slider() {
    new Swiper('.swiper', {
      modules: [Navigation],
      // loop: true,
      // loopAdditionalSlides: 1,
      slidesPerView: 'auto',
      spaceBetween: 64,
      speed: 500,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        slideNextTransitionStart: () => {
          console.log('to next');
          this.sliderState = 'next';
        },
        slideNextTransitionEnd: () => {
          console.log('to next end');
          this.sliderState = null;
        },
        slidePrevTransitionStart: () => {
          console.log('to prev');
          this.sliderState = 'prev';
        },
        slidePrevTransitionEnd: () => {
          console.log('to prev end');
          this.sliderState = null;
        },
      }
    });
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {

    //ウインドウとWebGL座標を一致させる
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _addMesh() {
    const imgArray = [...document.querySelectorAll('.slider img')];
    for(const img of imgArray) {
      const imgMesh = new Figure(img, this.scene);
      
      this.imgPlaneArray.push(imgMesh);
    }
  }

  init() {
    this._setRenderer();
    this._setCamera();

    this._addMesh();

    this._update();
    this._addEvent();
  }

  _update() {

    for(const img of this.imgPlaneArray) {
      img.update(this.sliderState);
    }

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();

window.addEventListener('load', ()=>{
  main.canvas.classList.add('is-loaded');
})
