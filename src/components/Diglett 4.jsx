/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: nguyenlouis32 (https://sketchfab.com/nguyenlouis32)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/diglett-3068de91e6af4492bbf6c76a61df03c7
title: Diglett
*/

//(1, -1) diglett

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ActiveHammer } from "./Cartoon_hammer";
import Bonksrc from "./bonk_sound.mp3";
import Laughtersrc from "./diglett_laughter.mp3";
import { lifeState } from "../atom/Life";
import { useSetRecoilState } from "recoil";

var isUp = false; //false 상태면 올라오지 않음
var isBonked = false; //true 상태면 올라오지 않음

var posY = -4;
var IntervalId;
var BonkLimitTimeout;

var isChanged = false; // 색이 바뀌었는지
var randColor = 2; // 두더지 종류

const laughSound = new Audio(Laughtersrc);

function digIn(speed) {
  //내려가는 애니메이션
  posY = posY - 0.1 * speed;

  if (posY <= -4) {
    posY = -4;

    if (!isChanged) {
      randColor = Math.floor(Math.random() * 1000) % 3; //0,1,2
      isChanged = true;
    }
  }
}

function digUp() {
  if (!isBonked && !isUp && posY < 0) {
    //망치를 맞은 직후도, 올라올 수 없는 상태도 아닌데 Y 좌표가 0 이하인 경우 상승
    clearInterval(IntervalId);
    posY += 0.2;
  }

  if (posY >= 0) {
    //Y 좌표가 0에 도달하면
    posY = 0;
    isUp = true;
    isBonked = false;
    isChanged = false;

    BonkLimitTimeout = setTimeout(() => {
      //2초가 지나도 맞지 않으면
      if (!isBonked) {
        //laughSound.play();
        digIn(2);
        setTimeout(() => {
          isUp = false;
        }, 5000);
        //score 계산 함수
      }
    }, 2000);
  }
}

function bonked(props) {
  var randTime = Math.floor(Math.random() * 20000) + 5000; //다시 나오는 딜레이 5초~25초

  if (isUp) {
    isBonked = true;
    IntervalId = setInterval(() => {
      digIn(7);
    }, 1);
    ActiveHammer(4);

    props.waveCamera();
    props.playBonkSound();

    clearTimeout(BonkLimitTimeout);
    //score 계산 함수
    setTimeout(() => {
      isUp = false;
      isBonked = false;
    }, randTime);
  } else {
    //score 계산 함수
  }
}

export default function Diglett(props) {
  const { nodes, materials } = useGLTF("model/diglett copy 4.glb");
  const group = useRef();

  var randTime = Math.floor(Math.random() * 20000) + 1000;

  useFrame(() => {
    changeColor(colors[randColor]);

    group.current.position.y = posY;
    setTimeout(() => {
      digUp();
    }, randTime);

    if (isBonked) {
      clearTimeout(BonkLimitTimeout);
    }
  });

  // 두더지 색 변경
  const colors = ["black", "yellow", "default"];
  const points = [-10, 10, 5];

  const [myMaterials, setMyMaterials] = useState(materials);
  function changeColor(color) {
    switch (color) {
      case "black":
        materials.Body00.color = { isColor: true, r: 0.2, g: 0.2, b: 0.2 };
        materials.material.color = { isColor: true, r: 0.2, g: 0.2, b: 0.2 };
        break;
      case "yellow":
        materials.Body00.color = { isColor: true, r: 1, g: 1, b: 0 };
        materials.material.color = { isColor: true, r: 1, g: 1, b: 0 };
        break;
      default:
        materials.Body00.color = { isColor: true, r: 1, g: 1, b: 1 };
        materials.material.color = { isColor: true, r: 1, g: 1, b: 1 };
    }
    setMyMaterials(materials);
  }

  // HP 바 반영
  const life = useSetRecoilState(lifeState);
  const onBonked = () => {
    bonked();
    props.waveCamera(props);

    life((prev) => {
      if (prev + points[randColor] >= 100) return 100;
      else return prev + points[randColor];
    });
  };

  return (
    <group
      ref={group}
      {...props}
      position={[6, -4, -6]}
      scale={0.15}
      onClick={onBonked}
    >
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        geometry={nodes.Object_6.geometry}
        material={myMaterials.Body00}
        skeleton={nodes.Object_6.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Object_7.geometry}
        material={myMaterials.material}
        skeleton={nodes.Object_7.skeleton}
      />
    </group>
  );
}

useGLTF.preload("model/diglett copy 4.glb");
