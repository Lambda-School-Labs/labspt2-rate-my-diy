import React, { Component } from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import CreatableSelect from 'react-select/lib/Creatable';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router';
import { UPDATE_PROJECT } from '../../query/query';

import Header from '../Home/Header/Header';

class EditProject extends Component {
  constructor(props) {
    super(props);

    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);
    const userPull = this.props.users.filter(
      (user) => user.email === json.email
    );
    const { username, email } = userPull[0];

    const categories = this.props.projects.map((project) => project.category);
    let filteredCategories = [...new Set(categories)];

    const {
      name,
      category,
      timestamp,
      titleImg,
      titleBlurb,
      steps
    } = this.props.project;
    let newSteps = [];
    if (typeof steps === 'string')
      newSteps = JSON.parse(steps).concat([{ type: '', body: '' }]);
    if (!typeof steps === 'string')
      newSteps = steps.concat([{ type: '', body: '' }]);

    this.state = {
      imgDeleteDisabled: true,
      categories: filteredCategories,
      username: username,
      email: email,
      submitDisabled: true,
      project: {
        name: name,
        category: category,
        timestamp: timestamp,
        titleImg: titleImg,
        titleBlurb: titleBlurb,
        steps: newSteps
      }
    };
  }

  componentWillUnmount = () => {
    console.log({ unMountState: this.state }, 'unmounting');
  };

  // componentWillMount = () => {
  //   console.log({newMountState: this.state})
  // }
  componentDidMount = () => {
    console.log({ newMountState: this.state });

    if (typeof this.state.project.steps === 'string') {
      let steps = this.state.project.steps;
      let array = JSON.parse(steps);
      this.setState({
        ...this.state,
        project: { ...this.state.project, steps: array }
      });
    }
  };
  // componentDidMount = async () => {

  //   try {
  //     const user = await localStorage.getItem('authUser');
  //     const json = await JSON.parse(user);
  //     const userPull = await this.props.users.filter(
  //       (user) => user.email === json.email
  //     );
  //     const { username, email } = await userPull[0];

  //     const categories = await this.props.projects.map((project) => project.category);
  //     let filteredCategories = await [...new Set(categories)];
  //     let steps = await this.state.project.steps

  //     // steps = JSON.parse(this.state.project.steps)

  //     await this.setState({
  //       ...this.state,
  //       imgDeleteDisabled: true,
  //       categories: filteredCategories,
  //       username: username,
  //       email: email,
  //     });

  //     await console.log({mountState: this.state})
  //   }
  //  catch(err) {
  //    console.log({mountError: err})
  //  }
  // };

  textChange = async (e) => {
    let value = e.target.value;
    let x = document.activeElement.tagName;
    await this.setState({
      project: {
        ...this.state.project,
        [e.target.name]: value
      }
    });

    console.log({ name: this.state.project.name, focus: x });
  };
  textChangeHandler = (index) => (e) => {
    const newText = this.state.project.steps.map((step, sidx) => {
      if (index !== sidx) return step;
      return { type: 'text', body: e.target.value };
    });

    const final = newText.concat([{ type: '', body: '' }]);

    this.setState({
      project: {
        ...this.state.project,
        steps: newText
      }
    });
    console.log({ steps: this.state.project.steps });
  };

  handleAddStep = () => {
    this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        steps: this.state.project.steps.concat([{ type: '', body: '' }])
      }
    });
    console.log({ steps: this.state.project.steps });
  };

  addImage = (img) => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );

    const newSteps = steps.concat({ type: 'img', body: img });

    const extraStep = newSteps.concat({ type: '', body: '' });

    this.setState({
      project: {
        ...this.state.project,
        steps: extraStep
      }
    });
  };

  deletePhoto = (idx) => () => {
    const steps = this.state.project.steps.filter(
      (step) => step !== { type: '', body: '' }
    );
    const filtered = steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: {
        steps: [filtered, { type: '', body: '' }]
      }
    });
    console.log({ steps: this.state.project.steps });
  };

  removeTextStep = (idx) => () => {
    const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx);
    this.setState({
      project: { steps: steps }
    });
    console.log({ steps: this.state.project.steps });
  };

  openCloudinary = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.addImage(image);
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  mainImage = (e) => {
    e.preventDefault();
    let options = {
      cloud_name: 'dv1rhurfd',
      upload_preset: 'korisbak',
      returnJustUrl: true,
      maxImageWidth: 400,
      maxImageHeight: 500
    };
    ReactCloudinaryUploader.open(options)
      .then((image) => {
        if (this.props.returnJustUrl) image = image.url;
        this.setState({
          imgDeleteDisabled: false,
          project: {
            ...this.state.project,
            titleImg: image
          }
        });
      })
      .catch((err) => {
        console.error({ error: err });
      });
  };

  deleteMainImg = () => {
    this.setState({
      ...this.state,
      imgDeleteDisabled: true,
      project: {
        ...this.state.project,
        category: ''
      }
    });
  };

  handleChange = async (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    let value = '';

    if (newValue !== null) value = await newValue.value;

    await this.setState({
      ...this.state,
      project: {
        ...this.state.project,
        category: value
      }
    });
    await console.log({ category: this.state.project.category });
  };
  // handleInputChange = (inputValue, actionMeta) => {
  //   this.setState({
  //     project: {
  //       ...this.state.project,
  //       category: inputValue
  //     }
  //   });

  //   console.group('Input Changed');
  //   console.log(inputValue);
  //   console.log(`action: ${actionMeta.action}`);
  //   console.log(`state: ${this.state.project.category}`);
  //   console.groupEnd();
  // };

  finalize = async (e) => {
    e.preventDefault();
    let steps = this.state.project.steps.map((step) => {
      return step.body;
    });
    try {
      const steps = await this.state.project['steps'];

      const filter = await steps.filter(
        (step) => step.type !== '' && step.body !== ''
      );

      const string = await JSON.stringify(filter);

      const date = await new Date(Date.now());

      const { name, category, titleImg, titleBlurb } = await this.state.project;

      await console.log({
        b4name: name,
        b4cat: category,
        b4titleImg: titleImg,
        b4titleBlurb: titleBlurb
      });

      await this.setState({
        ...this.state,
        submitDisabled: false,
        project: {
          name: name,
          category: category,
          titleImg: titleImg,
          titleBlurb: titleBlurb,
          steps: string,
          timestamp: date
        }
      });

      await console.log({ finalizeState: this.state });
    } catch (err) {
      console.log({ error: err });
    }
  };

  render() {
    const projCheck = () => {
      const proj = this.state.project;
      for (let key in proj) {
        if (proj[key] !== null && proj[key] != '') return false;
      }
      return true;
    };

    const userCheck = () => {
      if (this.state.username !== null && this.state.username != '') {
        return false;
      } else {
        return true;
      }
    };

    // const isEnabled = projCheck() && userCheck();

    const cats = this.state.categories.map((cat) => {
      return { value: cat, label: cat };
    });

    // const steps = JSON.parse(this.state.project.steps)

    if (
      this.state.project.steps != null &&
      typeof this.state.project.steps === 'object'
    ) {
      let type = typeof this.state.project.steps;
      console.log({ steps: this.state.project.steps, stepArray: type });
      return (
        <div className="projectInfo">
          <form>
            <h1>{`Edit ${this.state.project.name}`}</h1>
            <h2>project name:</h2>
            <input
              type="text"
              name="name"
              value={this.state.project.name}
              onChange={this.textChange}
            />
            <h2>main image:</h2>
            <div>
              <img src={this.state.project.titleImg} />
              {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
            </div>
            <button onClick={this.mainImage}>Set Main Image</button>
            <h2>project description:</h2>
            <textarea
              rows="6"
              cols="75"
              name="titleBlurb"
              value={this.state.project.titleBlurb}
              onChange={this.textChange}
            />
            <h2>category:</h2>
            <CreatableSelect
              isClearable
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              options={cats}
              value={{
                value: this.state.project.category,
                label: this.state.project.category
              }}
            />

            <h2>Steps:</h2>
            <div>
              {this.state.project['steps'].map((step, idx) => {
                if (step.type === 'img') {
                  return (
                    <div key={idx}>
                      <img src={step.body} />
                      <button onClick={this.deletePhoto(idx)}>
                        Delete Photo
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div key={step[idx]}>
                      <input
                        type="text"
                        value={step.body}
                        onChange={this.textChangeHandler(idx)}
                      />
                      <button
                        type="button"
                        onClick={this.removeTextStep(idx)}
                        className="small"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={this.handleAddStep}
                        className="small"
                      >
                        +
                      </button>
                      <button onClick={this.openCloudinary}>Add Picture</button>
                    </div>
                  );
                }
              })}
            </div>
            <button onClick={this.finalize}>Finalize</button>
            <button disabled={this.state.submitDisabled}>Submit</button>
          </form>
        </div>
      );
    } else {
      let type = typeof this.state.project.steps;
      console.log({
        type: type,
        steps: this.state.project.steps,
        stepArray: type
      });
      let steps = JSON.parse(this.state.project.steps);

      return (
        <Mutation mutation={UPDATE_PROJECT}>
          {(editProject, { loading, error, data }) => {
            if (loading) return <span>Submitting your changes...</span>;
            if (error) return <span>{`Error: ${error}`}</span>;
            if (data)
              return <Redirect to={`/${this.state.username}/projects`} />;
            return (
              <div className="projectInfo">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    editProject({
                      variables: {
                        name: this.state.project.name,
                        category: this.state.project.category,
                        timestamp: this.state.project.timestamp,
                        titleImg: this.state.project.titleImg,
                        titleBlurb: this.state.project.titleBlurb,
                        steps: this.state.project.steps,
                        username: this.state.username,
                        id: this.props.project.id
                      }
                    });
                    console.log({ data: this.props.data });
                  }}
                >
                  <h1>{`Edit ${this.state.project.name}`}</h1>
                  <h2>project name:</h2>
                  <input
                    type="text"
                    name="name"
                    value={this.state.project.name}
                    onChange={this.textChange}
                  />
                  <h2>main image:</h2>
                  <div>
                    <img src={this.state.project.titleImg} />
                    {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
                  </div>
                  <button onClick={this.mainImage}>Set Main Image</button>
                  <h2>project description:</h2>
                  <textarea
                    rows="6"
                    cols="75"
                    name="titleBlurb"
                    value={this.state.project.titleBlurb}
                    onChange={this.textChange}
                  />
                  <h2>category:</h2>
                  <CreatableSelect
                    isClearable
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    options={cats}
                  />
                  <h2>Steps:</h2>
                  <div>
                    {steps.map((step, idx) => {
                      if (step.type === 'img') {
                        return (
                          <div key={idx}>
                            <img src={step.body} />
                            <button onClick={this.deletePhoto(idx)}>
                              Delete Photo
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx}>
                            <input
                              type="text"
                              value={step.body}
                              onChange={this.textChangeHandler(idx)}
                            />
                            <button
                              type="button"
                              onClick={this.removeTextStep(idx)}
                              className="small"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={this.handleAddStep}
                              className="small"
                            >
                              +
                            </button>
                            <button onClick={this.openCloudinary}>
                              Add Picture
                            </button>
                          </div>
                        );
                      }
                    })}
                  </div>

                  <button type="button" onClick={this.finalize}>
                    Finalize
                  </button>
                  <button type="submit" disabled={this.state.submitDisabled}>
                    Submit
                  </button>
                </form>
              </div>
            );
          }}
        </Mutation>
      );
    }
  }
}

export default EditProject;

// import React, { Component } from 'react';
// import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
// import CreatableSelect from 'react-select/lib/Creatable';
// import { Redirect } from 'react-router';
// import gql from 'graphql-tag';
// import { Mutation } from 'react-apollo';
// import Header from '../Home/Header/Header';

// const UPDATE_PROJECT = gql`
//   mutation editProject(
//     $name: String!
//     $category: String!
//     $timestamp: String!
//     $titleImg: String!
//     $titleBlurb: String!
//     $steps: String!
//     $username: String!
//   ) {
//     newProject(
//       name: $name
//       category: $category
//       timestamp: $timestamp
//       titleImg: $titleImg
//       titleBlurb: $titleBlurb
//       steps: $steps
//       username: $username
//     ) {
//       id
//       name
//     }
//   }
// `;

// class EditProject extends Component {
//   constructor(props) {
//     super(props);

//     const user = localStorage.getItem('authUser');
//     const json = JSON.parse(user);
//     const userPull = this.props.users.filter(
//       (user) => user.email === json.email
//     );
//     const { username, email } = userPull[0];

//     const categories = this.props.projects.map((project) => project.category);
//     let filteredCategories = [...new Set(categories)];

//     const project = this.props.project;
//     const steps = JSON.parse(project.steps).concat([{ type: '', body: '' }]);

//     this.state = {
//       submitDisabled: true,
//       categories: filteredCategories,
//       username: username,
//       email: email,
//       text: '',
//       project: {
//         name: project.name,
//         steps: steps,
//         category: project.category,
//         timestamp: project.timestamp,
//         titleImg: project.titleImg,
//         titleBlurb: project.titleBlurb
//       }
//     };
//   }

//   componentWillUnmount() {
//     console.log('Unmounting');
//   }
//   componentWillMount() {
//     console.log('Mounting');
//   }

//   // componentDidMount = () => {
//   //   const user = localStorage.getItem('authUser');
//   //   const json = JSON.parse(user);
//   //   const userPull = this.props.users.filter(
//   //     (user) => user.email === json.email
//   //   );
//   //   const { username, email } = userPull[0];

//   //   const categories = this.props.projects.map((project) => project.category);
//   //   let filteredCategories = [...new Set(categories)];

//   //   const project = this.props.project;
//   //   const steps = JSON.parse(project.steps);
//   //   console.log({ steps: steps });

//   //   this.setState({
//   //     ...this.state,
//   //     categories: filteredCategories,
//   //     username: username,
//   //     email: email,
//   //     project: {
//   //       name: project.name,
//   //       steps: steps,
//   //       category: project.category,
//   //       timestamp: project.timestamp,
//   //       titleImg: project.titleImg,
//   //       titleBlurb: project.titleBlurb
//   //     }
//   //   });
//   // };

//   textChange = async (e) => {
//     let value = e.target.value;
//     let x = document.activeElement.tagName;
//     await this.setState({
//       project: {
//         ...this.state.project,
//         [e.target.name]: value
//       }
//     });

//     console.log({ name: this.state.project.name, focus: x });
//   };
//   textChangeHandler = (index) => (e) => {
//     const newText = this.state.project.steps.map((step, sidx) => {
//       if (index !== sidx) return step;
//       return { type: 'text', body: e.target.value };
//     });

//     const final = newText.concat([{ type: '', body: '' }]);

//     this.setState({
//       project: {
//         ...this.state.project,
//         steps: newText
//       }
//     });
//     console.log({ steps: this.state.project.steps });
//   };

//   handleAddStep = () => {
//     this.setState({
//       project: {
//         steps: this.state.project.steps.concat([{ type: '', body: '' }])
//       }
//     });
//     console.log({ steps: this.state.project.steps });
//   };

//   addImage = (img) => {
//     const steps = this.state.project.steps.filter(
//       (step) => step !== { type: '', body: '' }
//     );

//     const newSteps = steps.concat({ type: 'img', body: img });

//     const extraStep = newSteps.concat({ type: '', body: '' });

//     this.setState({
//       project: {
//         ...this.state.project,
//         steps: extraStep
//       }
//     });
//   };

//   deletePhoto = (idx) => () => {
//     const steps = this.state.project.steps.filter(
//       (step) => step !== { type: '', body: '' }
//     );
//     const filtered = steps.filter((step, sidx) => idx !== sidx);
//     this.setState({
//       project: {
//         steps: [filtered, { type: '', body: '' }]
//       }
//     });
//     console.log({ steps: this.state.project.steps });
//   };

//   removeTextStep = (idx) => () => {
//     const steps = this.state.project.steps.filter((step, sidx) => idx !== sidx);
//     this.setState({
//       project: { steps: steps }
//     });
//     console.log({ steps: this.state.project.steps });
//   };

//   openCloudinary = (e) => {
//     e.preventDefault();
//     let options = {
//       cloud_name: 'dv1rhurfd',
//       upload_preset: 'korisbak',
//       returnJustUrl: true,
//       maxImageWidth: 400,
//       maxImageHeight: 500
//     };
//     ReactCloudinaryUploader.open(options)
//       .then((image) => {
//         if (this.props.returnJustUrl) image = image.url;
//         this.addImage(image);
//       })
//       .catch((err) => {
//         console.error({ error: err });
//       });
//   };

//   mainImage = (e) => {
//     e.preventDefault();
//     let options = {
//       cloud_name: 'dv1rhurfd',
//       upload_preset: 'korisbak',
//       returnJustUrl: true,
//       maxImageWidth: 400,
//       maxImageHeight: 500
//     };
//     ReactCloudinaryUploader.open(options)
//       .then((image) => {
//         if (this.props.returnJustUrl) image = image.url;
//         this.setState({
//           imgDeleteDisabled: false,
//           project: {
//             ...this.state.project,
//             titleImg: image
//           }
//         });
//       })
//       .catch((err) => {
//         console.error({ error: err });
//       });
//   };

//   deleteMainImg = () => {
//     this.setState({
//       ...this.state,
//       imgDeleteDisabled: true,
//       project: {
//         ...this.state.project,
//         titleImg: ''
//       }
//     });
//   };

//   handleChange = async (newValue, actionMeta) => {
//     await console.group('Value Changed');
//     console.log(newValue);
//     console.log({ nVal: newValue.value });
//     console.log(`action: ${actionMeta.action}`);
//     console.log({ state: this.state });
//     console.groupEnd();

//     let value = await newValue.value;

//     await this.setState({
//       ...this.state,
//       project: {
//         ...this.state.project,
//         category: value
//       }
//     });
//     await console.log({ category: this.state.project.category });
//   };
//   // handleInputChange = (inputValue, actionMeta) => {

//   //   console.group('Input Changed');
//   //   console.log(inputValue);
//   //   console.log(`action: ${actionMeta.action}`);
//   //   // console.log(`state: ${this.state.project.category}`);
//   //   console.groupEnd();
//   // };

//   finalize = async (e) => {
//     e.preventDefault();
//     try {
//       const steps = this.state.project.steps;

//       const filter = await steps.filter(
//         (step) => step.type !== '' && step.body !== ''
//       );

//       const string = await JSON.stringify(filter);

//       const date = new Date(Date.now());

//       await this.setState({
//         ...this.state,
//         project: {
//           ...this.state.project,
//           steps: string,
//           timestamp: date,
//           submitDisabled: false
//         }
//       });
//       console.log({ state: this.state });
//     } catch (err) {
//       console.log({ err: err });
//     }
//   };

//   click = async (e) => {
//     e.preventDefault();
//     try {
//       await this.setState({ text: "I'm clicked" });
//       console.log({ text: this.state.text });
//     } catch (err) {
//       console.log({ err: err });
//     }
//   };

//   render() {
//     const projCheck = () => {
//       const proj = this.state.project;
//       for (let key in proj) {
//         if (proj[key] !== null && proj[key] != '') return false;
//       }
//       return true;
//     };

//     const userCheck = () => {
//       if (this.state.username !== null && this.state.username != '') {
//         return false;
//       } else {
//         return true;
//       }
//     };

//     // const isEnabled = projCheck() && userCheck();

//     const cats = this.state.categories.map((cat) => {
//       return { value: cat, label: cat };
//     });

//     // <div>
//     //   <button onClick={this.click}>Click</button>
//     // </div>
//     return (
//       <Mutation mutation={UPDATE_PROJECT}>
//         {(editProject, data, loading, error) => {
//           // <div>
//           if (loading) return <span>{`${loading}`}</span>;

//           if (error) return <span>{`${error}`}</span>;

//           if (data)
//             return (
//               <div className="projectInfo">
//                 <form
//                 // onSubmit={(e) => {
//                 //   e.preventDefault();
//                 //   e.stopPropagation();
//                 //   const steps = this.state.project.steps;

//                 //   const filter = steps.filter(
//                 //     (step) => step.type !== '' && step.body !== ''
//                 //   );

//                 //   const string = JSON.stringify(filter);

//                 //   const date = new Date(Date.now());

//                 //   // this.setState({
//                 //   //   ...this.state,
//                 //   //   project: {
//                 //   //     ...this.state.project,
//                 //   //     steps: string,
//                 //   //     timestamp: date
//                 //   //   }
//                 //   // });

//                 //   // editProject({
//                 //   //   variables: {
//                 //   //     name: this.state.project.name,
//                 //   //     category: this.state.project.category,
//                 //   //     timestamp: this.state.project.timestamp,
//                 //   //     titleImg: this.state.project.titleImg,
//                 //   //     titleBlurb: this.state.project.titleBlurb,
//                 //   //     steps: this.state.project.steps,
//                 //   //     username: this.state.username
//                 //   //   }
//                 //   // });
//                 //   console.log({ state: this.state });
//                 // }}
//                 >
//                   <h1>{`Edit ${this.state.project.name}`}</h1>
//                   <h2>project name:</h2>
//                   <input
//                     type="text"
//                     name="name"
//                     value={this.state.project.name}
//                     onChange={this.textChange}
//                   />
//                   <h2>main image:</h2>
//                   <div>
//                     <img src={this.state.project.titleImg} />
//                     {/* <button disabled={this.state.imgDeleteDisabled} onClick={this.deleteMainImg}>Delete Photo</button> */}
//                   </div>
//                   <button onClick={this.mainImage}>Set Main Image</button>
//                   <h2>project description:</h2>
//                   <textarea
//                     rows="6"
//                     cols="75"
//                     name="titleBlurb"
//                     value={this.state.project.titleBlurb}
//                     onChange={this.textChange}
//                   />
//                   <h2>category:</h2>
//                   <CreatableSelect
//                     isClearable
//                     onChange={this.handleChange}
//                     onInputChange={this.handleInputChange}
//                     options={cats}
//                     value={{
//                       value: this.state.project.category,
//                       label: this.state.project.category
//                     }}
//                   />
//                   <h2>Steps:</h2>
//                   {this.state.project.steps.map((step, idx) => {
//                     if (step.type === 'img') {
//                       return (
//                         <div key={idx}>
//                           <img src={step.body} />
//                           <button onClick={this.deletePhoto(idx)}>
//                             Delete Photo
//                           </button>
//                         </div>
//                       );
//                     } else {
//                       return (
//                         <div key={idx}>
//                           <input
//                             type="text"
//                             value={step.body}
//                             name="body"
//                             onChange={this.textChangeHandler(idx)}
//                           />
//                           <button
//                             type="button"
//                             onClick={this.removeTextStep(idx)}
//                             className="small"
//                           >
//                             -
//                           </button>
//                           <button
//                             type="button"
//                             onClick={this.handleAddStep}
//                             className="small"
//                           >
//                             +
//                           </button>
//                           <button onClick={this.openCloudinary}>
//                             Add Picture
//                           </button>
//                         </div>
//                       );
//                     }
//                   })}
//                   <button onClick={(e) => this.finalize(e)}>Finalize</button>
//                   <button type="submit" disabled={this.state.submitDisabled}>
//                     Submit
//                   </button>
//                 </form>
//               </div>
//               // </div>
//             );
//         }}
//       </Mutation>
//     );
//   }
// }

// export default EditProject;