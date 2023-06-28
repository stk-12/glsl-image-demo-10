import * as THREE from "three";
import { gsap, Power3 } from "gsap";
import { lerp } from "three/src/math/MathUtils";
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";

import imgDisp from '../images/displacement.jpg';

export default class Figure {
	constructor(el, scene) {
		this.$image = el;
		this.scene = scene

		this.loader = new THREE.TextureLoader()

		this.image = this.loader.load(this.$image.src)
    this.$image.style.opacity = 0
		this.sizes = new THREE.Vector2(0, 0)
		this.offset = new THREE.Vector2(0, 0)

    this.image2 = this.loader.load(this.$image.dataset.img)

    this.dispImage = this.loader.load(imgDisp);

    this.targetScrollY = 0;
    this.currentScrollY = 0;
    this.scrollOffset = 0;

    this.uniforms = {
      // uTime: {
      //   value: 0.0
      // },
      uScroll: {
        value: 0.0
      },
      uTex: {
        value: this.texture
      },
      uTex2: {
        value: this.image2
      },
      uTexDisp: {
        value: this.dispImage
      },
      uProg: {
        value: 0.0
      },
      uProg2: {
        // value: -0.4
        value: -0.4
      }
    };

    this.clock = new THREE.Clock();

		this.getSizes()

		this.createMesh()

    this.onMouseEnter();
    this.onMouseLeave();

	}

  getSizes() {
		const { width, height, top, left } = this.$image.getBoundingClientRect()

		this.sizes.set(width, height)
		this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
		// this.offset.set(left - width / 2, -top + window.innerHeight / 2 - height / 2)
	}

  createMesh() {
    //テクスチャ
    const loader = new THREE.TextureLoader();
    this.uniforms.uTex.value = loader.load(this.$image.src);


		this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      side: THREE.DoubleSide
      // wireframe: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.setParams();

		this.scene.add(this.mesh)
	}

  setParams() {
		this.mesh.position.set(this.offset.x, this.offset.y, 0)
		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
  }

  setSliderState(state) {
    if(state === 'next') {
      gsap.to(this.uniforms.uScroll, {
        // delay: 0.1,
        duration: 0.4,
        value: -120.0,
      })
    }
    if(state === 'prev') {
      gsap.to(this.uniforms.uScroll, {
        // delay: 0.1,
        duration: 0.4,
        value: 120.0,
      })
    }
    if(!state) {
      gsap.to(this.uniforms.uScroll, {
        duration: 0.3,
        value: 0.0,
      })
    }

  }

  onMouseEnter() {
    this.$image.addEventListener('mouseenter',()=>{
      gsap.to(this.uniforms.uProg2, {
        duration: 1.6,
        // ease: Power3.easeInOut,
        value: 1.0,
      })
    })
  }
  onMouseLeave() {
    this.$image.addEventListener('mouseleave',()=>{
      gsap.to(this.uniforms.uProg2, {
        duration: 1.6,
        // ease: Power3.easeInOut,
        value: -0.4,
      })
    })
  }

  // onScroll() {
  //   this.targetScrollY = document.documentElement.scrollTop;
  //   this.currentScrollY = lerp(this.currentScrollY, this.targetScrollY, 0.2);
  //   this.scrollOffset = this.targetScrollY - this.currentScrollY;
  //   this.uniforms.uScroll.value = this.scrollOffset;
  // }

  update(sliderState) {
    // const elapsedTime = this.clock.getElapsedTime();
    // this.uniforms.uTime.value = elapsedTime * 0.03;


    this.getSizes();
    this.setParams();


    this.setSliderState(sliderState);

    // this.onScroll();
  }
}