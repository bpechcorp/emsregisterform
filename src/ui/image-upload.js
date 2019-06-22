require("static/css/image-upload.css");
import React from 'react';
class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }
  _handleCancel(e){
    this.setState({
      imagePreviewUrl : null,
      file : null
    })
  }

  _handleImageChange(e) {
    console.error('go to _handleImageChange');
    e.preventDefault();
    e.stopPropagation();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} style={{maxHeight: '300px'}} />);
    } else {
      $imagePreview = null;
      //(<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        {!imagePreviewUrl ? 
        (<div className="formContainer">
          <div className="inputfile-container text-center">
            <input type="file" name="file2" onChange={this._handleImageChange.bind(this)}
              style={{display : 'none', overflow : 'hidden'}}
              id="file2" className="inputfile" multiple=""/>
            <label className="shiny-btn" onChange={this._handleImageChange.bind(this)}
              htmlFor="file2">
                {"Upload Image"}
              </label>
          </div>                    
        </div>) : null}
        <div className="imgPreview">
          {$imagePreview}
        </div>
        {imagePreviewUrl?(<div style={{display:'flex'}}>
          <button className="btn-submit-style shiny-btn" style={{ background: '#2ecc71'}}
            type="submit" 
            onClick={(e)=>this._handleSubmit(e)}>Verify</button>
           <button className="btn-submit-style shiny-btn" style={{ background: '#e74c3c'}}
            type="submit" 
            onClick={(e)=>this._handleCancel(e)}>Cancel</button>

        </div>) : null}
        
      </div>
    )
  }
}
export default ImageUpload;