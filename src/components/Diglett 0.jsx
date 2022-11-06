/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: nguyenlouis32 (https://sketchfab.com/nguyenlouis32)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/diglett-3068de91e6af4492bbf6c76a61df03c7
title: Diglett
*/

//(0, 0)(center) diglett

import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ActiveHammer } from "./Cartoon_hammer";
import { lifeState } from "../atom/Life";
import { useSetRecoilState } from "recoil";
import TWEEN from "@tweenjs/tween.js";

var pos = { x: 0, y: -4, z: 0 }; //두더지 위치
var posY;

var toZero = new TWEEN.Tween(pos)
  .to({ x: 0, y: 0, z: 0 }, 500)
  .easing(TWEEN.Easing.Elastic.Out)
  .onUpdate(() => {
    posY = pos.y;
  });
var toUnder = new TWEEN.Tween(pos)
  .to({ x: 0, y: -4, z: 0 }, 100)
  .easing(TWEEN.Easing.Quartic.Out)
  .onUpdate(() => {
    posY = pos.y;
  });

var isUp = false; //올라와 있는지
var BonkLimitTimeout; //망치에 맞지 않은 두더지가 들어가는 Timeout의 ID
var randColor = Math.floor(Math.random() * 1000) % 3; // 두더지 종류

function digIn() {
  toZero.stop();
  toUnder
    .onComplete(() => {
      waiting();
      isUp = false;
    })
    .start();
}

function digUp() {
  if (!isUp) {
    // 올라와 있지 않은 경우에만 가능
    toUnder.stop();
    toZero
      .onStart(() => {
        randColor = Math.floor(Math.random() * 1000) % 3;
      })
      .onComplete(() => {
        isUp = true;

        //2초가 지나도 맞지 않으면
        BonkLimitTimeout = setTimeout(() => {
          digIn();
        }, 2000);
      })
      .start();
  }
}

function bonked(props) {
  if (isUp) {
    digIn();
    ActiveHammer(0);

    //효과음
    props.waveCamera();
    props.playBonkSound();

    //망치에 맞았으니 그냥 들어가는 대기 초기화
    clearTimeout(BonkLimitTimeout);
  }
}

function waiting() {
  var randTime = Math.floor(Math.random() * 20000) + 5000; //다시 나오는 딜레이 5초~25초(5000~25000)

  setTimeout(() => {
    digUp();
  }, randTime);
}

export default function Diglett(props) {
  const { nodes, materials } = useGLTF("model/diglett.glb");
  const group = useRef();

  // 처음에 한번만 실행
  var randTime = Math.floor(Math.random() * 10000) + 1000;
  useEffect(() => {
    setTimeout(() => {
      digUp();
    }, randTime);
  }, []);

  useFrame(() => {
    changeColor(colors[randColor]);

    group.current.position.y = posY;
    if (toZero.isPlaying) toZero.update();
    if (toUnder.isPlaying) toUnder.update();
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
    bonked(props);

    console.log("두더지 종류(black, yellow, default) - " + randColor);
    life((prev) => {
      if (prev + points[randColor] >= 100) return 100;
      else return prev + points[randColor];
    });
  };

  return (
    <group
      ref={group}
      {...props}
      position={[0, -4, 0]}
      scale={0.15}
      onClick={onBonked}
      color={"000"}
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

useGLTF.preload("model/diglett.glb");
