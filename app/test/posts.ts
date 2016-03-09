/// <reference path="../typings/tsd.d.ts" />
import * as supertest from "supertest";
import * as test from "tape";
import * as HTTPStatus from "http-status";

let request = supertest("http://ApiServer");

interface PostCallback {
  (id: number): void;
}
let createPost = (t: test.Test, cb: PostCallback) => {
  let url = "/posts";
  request
    .post(url)
    .send({ body: "Hello, world!" })
    .expect(HTTPStatus.CREATED)
    .expect("Content-type", /^application\/json/)
    .end((err: Error, res: supertest.Response) => {
      t.equal(err, null, `POST ${url} err was not null`);
      if (err) {
        t.end();
        return;
      }

      t.equal(typeof res.body.id, "number", `POST ${url} body.id was not a number`);
      cb(res.body.id);
    });
};

test("Post creation endpoint Should return the new post's id", (t: test.Test) => {
  createPost(t, (id: number) => t.end());
});
test("Post endpoint Should return a post", (t: test.Test) => {
  createPost(t, (id: number) => {
    let url = "/post/" + id;
    request
      .get(url)
      .expect(HTTPStatus.OK)
      .expect("Content-type", /^application\/json/)
      .end(function getPostEnd(err: Error, res: supertest.Response) {
        t.equal(err, null, `GET ${url} err was not null`);
        t.end();
      });
  });
});
test("Post endpoint Should delete a post", (t: test.Test) => {
  createPost(t, (id: number) => {
    let url = "/post/" + id;
    request
      .delete(url)
      .expect(HTTPStatus.OK)
      .expect("Content-type", /^application\/json/)
      .end(function deletePostEnd(err: Error, res: supertest.Response) {
        t.equal(err, null, `DELETE ${url} err was not null`);
        t.end();
      });
  });
});
test("Post endpoint Should update a post", (t: test.Test) => {
  createPost(t, (id: number) => {
    let url = "/post/" + id;
    let body = { body: "Jello, world!" };
    request
      .put(url)
      .send(body)
      .expect(HTTPStatus.OK)
      .expect("Content-type", /^application\/json/)
      .end(function updatePostEnd(err: Error, res: supertest.Response) {
        t.equal(err, null, `PUT ${url} err was not null`);
        t.equal(res.body.body, body.body, `PUT ${url} request and response bodies did not match`);
        t.end();
      });
  });
});