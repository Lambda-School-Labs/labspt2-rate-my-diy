import React from 'react';
import ReactCloudinaryUploader from '@app-masters/react-cloudinary-uploader';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { editUser } from '../../query/query';

const GET_USER = gql`
  query user($email: String!) {
    user(where: { email: $email }) {
      id
      username
      userProfileImage
      bio
      email
    }
  }
`;

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfileImage: this.props.user.userProfileImage,
      bio: this.props.user.bio,
      username: this.props.user.username
    };
  }

  componentDidMount() {
    const user = localStorage.getItem('authUser');
    const json = JSON.parse(user);

    if (json !== null && json !== undefined) {
      if (json.email !== this.props.email) {
        return <Redirect to="/" />;
      }
      return null;
    } else {
      //Redirect
      return <Redirect to="/" />;
    }
  }

  textChange = async (e) => {
    let value = e.target.value;
    await this.setState({
      ...this.state,
      [e.target.name]: value
    });
  };

  addImg = (img) => {
    this.setState({
      ...this.state,
      userProfileImage: img
    });
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

  render() {
    const email = this.props.email;

    return (
      <Mutation mutation={editUser}>
        {(editUser, { loading, data, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) {
            console.log({ error });
            return <div>There was an error.</div>;
          }
          // if (editData) {
          //   return (
          //     <div>
          //     <h1>{`${this.state.username}`}</h1>
          //     <img src={`${this.state.userProfileImage}`}/>
          //     <p>{`${this.state.bio}`}</p>

          //     </div>
          //   )
          // }
          if (data) {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await editUser({
                    variables: {
                      userProfileImage: this.state.userProfileImage,
                      bio: this.state.bio,
                      email: this.props.email
                    }
                  });

                  // await this.setState({
                  //   ...this.state,
                  //   userProfileImage: data.editUser.userProfileImage,
                  //   bio: data.editUser.bio,
                  // });
                }}
              >
                <h1>{`${this.state.username}`}</h1>
                <div>
                  <img src={this.state.userProfileImage} />
                </div>
                <button onClick={this.openCloudinary}>Set Profile Image</button>
                <h3>Bio</h3>
                <textarea
                  rows="6"
                  cols="75"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.textChange}
                />
                <button type="submit">Submit</button>
              </form>
            );
          }
          return (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await editUser({
                  variables: {
                    userProfileImage: this.state.userProfileImage,
                    bio: this.state.bio,
                    email: this.props.email
                  }
                });

                // await this.setState({
                //   ...this.state,
                //   userProfileImage: data.editUser.userProfileImage,
                //   bio: data.editUser.bio
                // })
              }}
            >
              <h1>{`${this.state.username}`}</h1>
              <div>
                <img src={this.state.userProfileImage} />
              </div>
              <button onClick={this.openCloudinary}>Set Profile Image</button>
              <h3>Bio</h3>
              <textarea
                rows="6"
                cols="75"
                name="bio"
                value={this.state.bio}
                onChange={this.textChange}
              />
              <button type="submit">Submit</button>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default ProfileInfo;
