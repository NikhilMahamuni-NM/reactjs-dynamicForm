import React from 'react';

class DynamicForm extends React.Component {

  constructor(props) {
    super();
    this.handleOnChange = this.handleOnChange.bind(this);
    this.state = {
      jsonValues : []
    }
  }

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  handleOnChange(json) { 
    let data = this.isJson(json)
    if (!data) {
      return "InValid Data"
    } 
    this.setState(() => {
        return {
          jsonValues : JSON.parse(json)
        }
    })
    
  }

  render() {
    return (
      <div>
        <UploadForm onChange={this.handleOnChange}/>
        {this.state.jsonValues.length > 0 && <RenderForm data = {this.state.jsonValues}/>}

      </div>
    )
  }
}


class UploadForm extends React.Component {

  constructor(props) {
    super(props);
    this.localOnChange = this.localOnChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this)
    this.state = {
      pass : undefined
    }
  }

  localOnChange(e) {
    e.preventDefault();
    const data = e.target.elements.json.value.trim()
    const pass = this.props.onChange(data)

    this.setState(() => {
      return {
        pass : pass
      }
    })
    
  }

  fileUpload(e) {
    e.preventDefault();
    let textArea = document.getElementById('ta')

    var fileReader=new FileReader();
    fileReader.onload=function(){

      textArea.textContent = fileReader.result;

    }
    fileReader.readAsText(e.target.files[0]);
    e.target.value = ''
    
  }
  
  render() {

    return (
      <div>
        <h1>Upload JSON File</h1>
        <br /><label>Upload File : </label><input type="file" onChange={this.fileUpload} accept=".json" name="json_file" multiple />
        <p>{this.state.pass && this.state.pass}</p>
        <form onSubmit={this.localOnChange}>
          <textarea id="ta" name="json" rows="20" cols="50"></textarea>
          
          <br /><button>Submit JSON</button>
        </form>
        
      </div>
    )
  }
}

class RenderForm extends React.Component {

  constructor(props) {
    super(props);
    this.getFormData = this.getFormData.bind(this);
  }

  getFormData(e) {
    e.preventDefault();
    let exp = {}
    
    const data = e.target.elements;
    for(var i=0; i<data.length;i++) {
      if (data[i]['name'].trim() !== '') {
        exp[data[i]['name']] =  data[i]['value'];
      }
      
    }
    
    const textToBLOB = new Blob([JSON.stringify(exp)], { type: 'text/plain' });
        const sFileName = 'formData.json';	   // The file to save the data.

        let newLink = document.createElement("a");
        newLink.download = sFileName;

        if (window.webkitURL != null) {
            newLink.href = window.webkitURL.createObjectURL(textToBLOB);
        }
        else {
            newLink.href = window.URL.createObjectURL(textToBLOB);
            newLink.style.display = "none";
            document.body.appendChild(newLink);
        }

        newLink.click(); 

  }
  
  render() {
    return (
      <div >
        <form onSubmit={this.getFormData}>
          {this.props.data.map((d) => {
            return <RenderElements 
                      key={d.key} eleType={d.data_buildertype} label={d.label} options={d.data_elements} name={d.key}
                    />
          })}
          <button>Export Data</button>
        </form>
      </div>
    )
  }
}

class RenderElements extends React.Component {
  
  dyFM(eleType, label, options, name) {
    let out;

    if (eleType === 'input') {
      out = <p> {label} : <input  type="text" name={name} /></p>
    } else if (eleType === 'numberformat') {
      out = <p> {label} : <input  type="number" name={name} /></p>
    } else if (eleType === 'checkbox') {
      out = <p> {label} :<input type="checkbox" name={name} /></p>
    } else if (eleType === 'dropdown') {
      out = (
          <p>
            <label>{label} : </label>
  
            <select name={name} >
              {options.map((option) => {
                return <option key={option['value']} value={option['value']}>{option['text']}</option>
              })}
            </select>
          </p>
      )
    } else {
      out = ''
    }
    return out
  }

  render() {
    return (
      this.dyFM(this.props.eleType, this.props.label, (this.props.options && this.props.options), this.props.name)
    )
  }
}


function App() {
  return (<div>
      
      <DynamicForm />
      
    </div>)
  
  
}

export default App;
