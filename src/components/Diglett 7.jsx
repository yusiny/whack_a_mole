/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: nguyenlouis32 (https://sketchfab.com/nguyenlouis32)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/diglett-3068de91e6af4492bbf6c76a61df03c7
title: Diglett
*/

//(-1, 0) diglett

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ActiveHammer } from "./Cartoon_hammer";
import Bonksrc from "./bonk_sound.mp3";
import Laughtersrc from "./diglett_laughter.mp3";

var isUp = false; //false 상태면 올라오지 않음
var isBonked = false; //true 상태면 올라오지 않음
var posY = -4;
var IntervalId;

const bonkSound = new Audio(Bonksrc);
const laughSound = new Audio(Laughtersrc);

function digIn(speed){ //내려가는 애니메이션
  posY = posY - 0.1 * speed;
  
  if(posY <= -4){
    posY = -4;
  }
}

function digUp(){
  if(!isBonked && !isUp && posY < 0){
    clearInterval(IntervalId);
    posY +=0.1;
  }
  
  if(posY >= 0){
    posY = 0;
    isUp = true;
    isBonked = false;
    setTimeout(() => { //2초가 지나도 맞지 않으면
      if(!isBonked){
        laughSound.play();
        digIn(2);
        setTimeout(() => {isUp = false;}, 5000);
        //score 계산 함수
      }
    }, 2000);
  }
}

function bonked(){
  var randTime = Math.floor(Math.random()*10000) + 3000; //다시 나오는 딜레이 3초~13초 
  bonkSound.currentTime = 0;
  if(isUp){
    IntervalId = setInterval(() => {digIn(7);}, 1);
    ActiveHammer(7);
    bonkSound.play();
    isBonked = true;
    //score 계산 함수
    setTimeout(() => {isUp = false; isBonked = false;}, randTime);
  }
  else{
    //score 계산 함수
  }
}

export default function Diglett(props) {
  const { nodes, materials } = useGLTF("model/diglett copy 7.glb");
  const group = useRef();
  bonkSound.loop = false;
  var randTime = Math.floor(Math.random()*10000);

  useFrame(() =>{
    group.current.position.y = posY;
    setTimeout(()=>{digUp();},randTime)
  })

  return (
    <group ref={group} {...props} position={[-6, -4, 0]} scale={0.15} onClick={bonked}>
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        geometry={nodes.Object_6.geometry}
        material={materials.Body00}
        skeleton={nodes.Object_6.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Object_7.geometry}
        material={materials.material}
        skeleton={nodes.Object_7.skeleton}
        />
    </group>
  );
}

useGLTF.preload("model/diglett copy 7.glb");
