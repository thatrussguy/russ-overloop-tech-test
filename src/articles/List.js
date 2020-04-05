import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

import "./List.css";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      error: null,
      territories: null,
      filter: [],
    };
  }

  async fetch() {
    try {
      await new Promise((res) =>
        this.setState(
          {
            loading: true,
          },
          res
        )
      );
      let result = await fetch(`/api/articles/`);
      if (result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }
      let json = await result.json();
      this.setState({
        loading: false,
        error: null,
        data: json.articles,
        territories: json.territories,
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e,
      });
    }
  }

  handleFilterChange = ({ target: { options } }) => {
    this.setState({
      filter: Array.from(options)
        .filter(({ selected }) => selected)
        .map(({ value }) => value),
    });
  };

  componentWillMount() {
    this.fetch();
  }

  render() {
    const { data, error, filter, loading, territories } = this.state;
    if (error) {
      return <div>{error.toString()}</div>;
    }
    if (loading) {
      return <div>Loading</div>;
    }
    return (
      <React.Fragment>
        <div>
          <Button tag={Link} to="/articles/create">
            Create a new Article
          </Button>
        </div>
        <div>
          <Form>
            <FormGroup row>
              <Label for="territorySelect" sm={2}>
                Select territories (ctrl+click for multiple)
              </Label>
              <Col sm={10}>
                <Input
                  onChange={this.handleFilterChange}
                  // show up to 10 options at a time
                  size={String(Math.min(10, territories.length))}
                  type="select"
                  id="territorySelect"
                  multiple
                >
                  <option hidden></option>
                  {territories.map(({ name, _id }) => (
                    <option key={_id}>{name}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
          </Form>
        </div>
        <ul className="ArticleList">
          {// filter based on selected territories (if any)
          (filter.length
            ? data.filter(({ territories }) =>
                territories
                  .map(({ name }) => name)
                  .some((territory) => filter.includes(territory))
              )
            : data
          ).map((article) => (
            <li key={article._id}>
              <div>{new Date(article.created).toLocaleDateString()}</div>
              <Link to={`/articles/${article._id}/`}>
                <h4>{article.title}</h4>
              </Link>
              <div>{article.content}</div>
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default List;
