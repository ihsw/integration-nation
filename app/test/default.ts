/// <reference path="../typings/index.d.ts" />
import * as supertest from "supertest";
import * as test from "tape";
import * as HTTPStatus from "http-status";

const request = supertest("http://ApiServer");

test("Homepage Should return standard greeting", (t: test.Test) => {
  const url = "/";
  request
    .get(url)
    .expect(HTTPStatus.OK)
    .expect("Content-type", /^text\/plain/)
    .expect("Hello, world!")
    .end((err: Error) => {
      t.equal(err, null, `GET ${url} err was not null`);
      t.end();
    });
});
test("Ping endpoint Should respond to standard ping", (t: test.Test) => {
  const url = "/ping";
  request
    .get(url)
    .expect(HTTPStatus.OK)
    .expect("Content-type", /^text\/plain/)
    .expect("Pong")
    .end((err: Error) => {
      t.equal(err, null, `GET ${url} err was not null`);
      t.end();
    });
});
test("Json reflection Should return identical Json in response as provided by request", (t: test.Test) => {
  const url = "/reflection";
  const body = { greeting: "Hello, world!" };
  request
    .post(url)
    .send(body)
    .expect(HTTPStatus.OK)
    .expect("Content-type", /^application\/json/)
    .end((err: Error, res: supertest.Response) => {
      t.equal(err, null, `POST ${url} err was not null`);
      if (err) {
        t.end();
        return;
      }

      t.equal(res.body.greeting, body.greeting, `POST ${url} greeting matched`);
      t.end();
    });
});
