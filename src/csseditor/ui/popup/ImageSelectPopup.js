import { EVENT } from "../../../util/UIElement";
import BasePopup from "./BasePopup";
import { LOAD, CLICK, VDOM } from "../../../util/Event";
import { Length } from "../../../editor/unit/Length";
import { editor } from "../../../editor/editor";


export default class ImageSelectPopup extends BasePopup {

  getTitle() {
    return 'Select a image'
  }

  getClassName() {
    return 'compact'
  }

  initState() {

    return {
      value: ''
    }
  }


  updateData(opt = {}) {
    this.setState(opt, false);

    this.state.context.trigger(this.state.changeEvent, this.state.value, {
      width: this.state.width,
      height: this.state.height,
      naturalWidth: this.state.naturalWidth,
      naturalHeight: this.state.naturalHeight      
    });
  }


  getBody() {
    return /*html*/`
      <div class="image-select-popup">
        <div class='box' ref='$imageBox'>
          
        </div>
      </div>
    `;
  }

  [LOAD('$imageBox') + VDOM] () {
    var project = editor.selection.currentProject || { images: [] }

    return project.images.map( (image, index) => {
      return /*html*/`<div class='image-item' ><img src= '${image.local}' /></div>`
    })
  }

  [CLICK('$imageBox .image-item')] (e) {
    var $img = e.$delegateTarget.$('img');

    this.updateData({
      value: $img.attr('src'),
      naturalWidth: Length.px($img.naturalWidth),
      naturalHeight: Length.px($img.naturalHeight), 
      width: Length.px($img.naturalWidth),
      height: Length.px($img.naturalHeight)
    });

    this.trigger('hideImageSelectPopup')
  }

  [EVENT("showImageSelectPopup")](data, params) {
    this.setState({
      context: data.context,
      changeEvent: data.changeEvent,
      value: data.value,
      params
    }, false);
    this.refresh();

    this.show(500);
  }

  [EVENT("hideImageSelectPopup")]() {
    this.hide();
  }


}
