import React, {ReactNode} from 'react'
import { SiHtml5, SiTypescript, SiJson } from "react-icons/si";
import { IoLogoJavascript, IoLogoHtml5 } from "react-icons/io5";
import { FaCss3Alt } from "react-icons/fa";
import { FcFolder, FcOpenedFolder, FcPicture, FcFile } from "react-icons/fc";
import { AiFillFileText } from "react-icons/ai";
import { VscJson } from "react-icons/vsc";
import { BsFiletypePng } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { FaFolder } from "react-icons/fa6";
import { FaFolderOpen } from "react-icons/fa6";
import { FaJava } from "react-icons/fa";

function getIconHelper() {
  const cache = new Map<string, ReactNode>();
  cache.set("js", <IoLogoJavascript color="#fbcb38"/>);
  cache.set("jsx", <IoLogoJavascript color="#fbcb38"/>);
  cache.set("ts", <SiTypescript color="#378baa"/>);
  cache.set("tsx", <SiTypescript color="#378baa"/>);
  cache.set("css", <FaCss3Alt color="purple"/>);
  cache.set("json", <VscJson color="#5656e6"/>);
  cache.set("html", <IoLogoHtml5 color="#e04e2c"/>);
  cache.set("png", <BsFiletypePng/>);
  cache.set("jpg", <BsFiletypeJpg/>);
  cache.set("java", <FaJava/>);
  
  // cache.set("ico", <FcPicture/>);
  cache.set("txt", <FiFileText color="white"/>);
  cache.set("closedDirectory", <FaFolder/>);
  cache.set("openDirectory", <FaFolderOpen/>);
  return function (extension: string, name: string): ReactNode {
    if (cache.has(extension))
      return cache.get(extension);
    else if (cache.has(name))
      return cache.get(name);
    else
      return <FcFile/>;
  }
}

export const getIcon = getIconHelper();
