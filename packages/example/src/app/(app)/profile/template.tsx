"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
const spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};
export default function AnimatedTemplate(props: PropsWithChildren) {
  return (
    <motion.div
      key={props.children ? "animated-child" : "empty"}
      initial={{ opacity: 0, x: -100 }} // 初始状态：不透明且偏移到左侧
      animate={{ opacity: 1, x: 0 }} // 进入时：完全不透明且在正常位置
      exit={{ opacity: 0, x: 100 }} // 离开时：不透明度为0且偏移到右侧
      transition={spring} // 动画持续时间
      className="h-full w-full bg-white"
    >
      {props.children}
    </motion.div>
  );
}
