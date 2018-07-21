import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Overlay,
  Spinner,
  Toaster,
  Intent,
  Position,
} from '@blueprintjs/core';

class Detox extends Component
{
  state = {
    detox: null
  }

  componentDidMount() {
    this.loadDetox();
  }

  loadDetox = () => {
    axios
      .get('/api/detox')
      .then(res => this.setState({ detox: res.data }))
  }

  render() {
    const { detox } = this.state;

    return (
      <section className="top details">
        {detox && (
          <React.Fragment>
            <div className="container">
              <div className="row">
                <div className="col-md-2">
                  <Link to="/" title="" className="details--return"><i className="fa fa-fw fa-long-arrow-alt-left"></i> Home</Link>
                </div>
                <div className="col-md-6">
                  <h1>{detox.name}</h1>
                  <div className="details--description" dangerouslySetInnerHTML={{__html: detox.description }}></div>
                </div>
              </div>
            </div>
            <br />
            <div className="container">
              <div className="row">
                <div className="col-md-offset-1 col-md-11">
                  <div className="row">
                    {detox.children.map((dt, index) => (
                      <div className="col-xs-12 col-md-4 blue-line" key={index}>
                        <div className="detox-card">
                          <Link to={`/${dt.slug}/${dt.id}`} title="" className="figure">
                            <figure><img src={`/images/foods/thumb_${dt.id}.jpg`} alt="" /></figure>
                            <div className="detox-card--title">{dt.name}</div>
                          </Link>
                          <div className="detox-card--desc" dangerouslySetInnerHTML={{__html: dt.short_description}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {!detox && <div className="loading"><Spinner intent="primary" large={true} /></div>}
      </section>
    )
  }
}

export default Detox;
