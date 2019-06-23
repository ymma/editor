import UIElement, { EVENT } from "../../../util/UIElement";

import { editor } from "../../../editor/editor";
import { DEBOUNCE, LOAD, } from "../../../util/Event";
import { CSS_TO_STRING } from "../../../util/css/make";
import { EMPTY_STRING } from "../../../util/css/types";

export default class StyleView extends UIElement {

  template() {
    return `
    <div class='style-view' style='display:none'>
      <div ref='$styleArea'>
        <style type='text/css' ref='$style'></style>  
      </div>
      <div ref='$svgArea'>
        <svg width="0" height="0" ref='$svg'></svg>   
      </div>
    </div>
    `;
  }

  makeStyle (item) {
    const {
      rootVariable, 
      css, 
      selectorString, 
      keyframeString 
    } = item.generateView(`[data-id='${item.id}']`)
    return `<style type='text/css'>
      :root {
        ${CSS_TO_STRING(rootVariable)}
      }

      /* element */
      [data-id='${item.id}'] { 
        ${CSS_TO_STRING(css)}; 
      }  

      ${selectorString}

      /* keyframe */
      ${keyframeString}
    </style>
    ` + item.layers.map(it => {
      return this.makeStyle(it);
    })
  }
 
  [LOAD('$styleArea')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.artboards.map(item => {
      return this.makeStyle(item)
    })
  } 


  makeSvg (item) {
    const SVGString = item.toSVGString()
    return `
      ${SVGString ? `<svg width="0" height="0">${SVGString}</svg>` : EMPTY_STRING}
    ` + item.layers.map(it => {
      return this.makeSvg(it);
    })
  }

  [LOAD('$svgArea')] () {

    var project = editor.projects[0] || { layers : [] }

    return project.layers.map(item => {
      return this.makeSvg(item)
    })
  }   

  [EVENT('refreshComputedStyle') + DEBOUNCE(100)] (last) {
    var computedCSS = this.refs.$canvas.getComputedStyle(...last)
    
    this.emit('refreshComputedStyleCode', computedCSS)
  }

  [EVENT("refreshCanvas")]() { 
    this.refresh()
  }
}