# grpc-web-ts-compiler

Generate browser client (js + d.ts) files from proto files
using [protoc](https://grpc.io/docs/protoc-installation/) 3.20.3
and [grpc-web](https://github.com/grpc/grpc-web).  

The server must also implement [grpc-web](https://github.com/grpc/grpc-web) for this to work.  

## Install

`npm install --save-dev grpc-web-ts-compiler`

**Notes** regarding included [google-protobuf](https://www.npmjs.com/package/google-protobuf) and [@improbable-eng/grpc-web](https://www.npmjs.com/package/@improbable-eng/grpc-web) libs:

* if you're not using a bundler like webpack, depending on how your frontend is built and consumed, you might get missing function errors; if this happens, ensure these are available at runtime.

* if you're using a bundler that creates a `licenses.txt` file during build but libs are not included, you need to install them separately as production dependencies, to be corectly picked up.

## Usage

`npx proto "path/to/proto/dir" "path/to/generated/js_ts/dir"`

**Note** only the top level proto files are processed by protoc binary, so ensure no subdirs are used
