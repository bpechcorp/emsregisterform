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
    this.setState({
      file : null,
      imagePreviewUrl : 'loading'
    })

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
    if (imagePreviewUrl && imagePreviewUrl !== 'loading') {
      $imagePreview = (<img src={imagePreviewUrl} style={{maxHeight: '300px'}} />);
    } else {
      $imagePreview = null;
      //(<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="content-container">
        <div className="previewComponent" style ={!!imagePreviewUrl? {background: 'rgba(108, 117, 125, 0.4)',borderRadius: '18px'}: {}}>
          {!imagePreviewUrl ? 
          (<div className="formContainer">
            <div className="inputfile-container text-center" style={{display: 'flex',flex: 1,flexDirection: 'column-reverse'}}>
              <input type="file" name="file2" onChange={this._handleImageChange.bind(this)}
                style={{display : 'none', overflow : 'hidden'}}
                id="file2" className="inputfile" multiple=""/>
              <label className="shiny-btn" onChange={this._handleImageChange.bind(this)}
                htmlFor="file2" style={{height: '25x'}}>
                  {"Upload Image"}
                </label>
            </div>                    
          </div>) : null}
          <div className="imgPreview">
            {$imagePreview}
          </div>
        </div>
        {imagePreviewUrl?(<div style={{display:'flex', margin : '0 auto', marginBottom:'10vh'}}>
            <div className="btn-submit-style shiny-btn" style={{ background: '#00b6f0'}}
              type="submit" 
              onClick={(e)=>this._handleSubmit(e)}>Verify</div>
            <div className="btn-submit-style shiny-btn" style={{ background: '#fc4a4a'}}
              type="submit" 
              onClick={(e)=>this._handleCancel(e)}>Cancel</div>

          </div>) : null}        
      </div>
      
    )
  }
}
export default ImageUpload;