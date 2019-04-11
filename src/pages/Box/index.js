import React, { Component } from 'react';
import api from '../../services/api'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import { MdInsertDriveFile } from 'react-icons/md'

import logo from '../../assets/logo.svg'
import './styles.css'

export default class Box extends Component {
  state = {
    box: {}
  }

  async componentDidMount() {
    this.subscribeToNewsFiles()

    const boxId = this.props.match.params.id
    const response = await api.get(`boxes/${boxId}`)

    this.setState({ box: response.data })
  }

  subscribeToNewsFiles = () => {
    const boxId = this.props.match.params.id
    const io = socket('https://omnistack-backend-matheus.herokuapp.com')

    io.emit('connectRoom', boxId)

    io.on('file', newFile => {
      this.setState({ box: { ...this.state.box, files: [newFile, ...this.state.box.files] } })
    })
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData()
      const boxId = this.props.match.params.id

      data.append('file', file)

      api.post(`boxes/${boxId}/files`, data)
    })
  }

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="Logo" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" target="_blank" rel="noopener noreferrer" href={file.url}>
                  <MdInsertDriveFile size={24} color="#A5CFFF" />
                  <strong>{file.title}</strong>
                </a>
                <span>há {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
                })}</span>
              </li>
            ))}
        </ul>
      </div>
    )
  }
}
