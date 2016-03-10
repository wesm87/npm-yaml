'use strict';

// Dependencies
const args      = process.argv;
const fs        = require( 'fs' );
const yaml      = require( 'js-yaml' );
const parseYAML = require( 'json2yaml' ).stringify;
const parseJSON = JSON.stringify;


class npmYAML {

  /**
   * Class constructor.
   */
  constructor() {

    console.log( args.length );

    // `npm` actually runs `node npm` so `args.length` == 2 by default.
    if ( args.length > 2 ) {

      // Return if not currently running `npm install` or `npm i`.
      let command = args[2];
      if ( command !== 'install' && command !== 'i' ) {
        console.log( 'Not `npm install`' );
        return;
      }

      // Otherwise, update `package.json` or create `package.yml`
      this.updatePackageFile();
    }
  }

  loadYAML( file ) {

    try {
      return yaml.safeLoad( fs.readFileSync( file ) );
    } catch( error ) {
      console.log( error );
      return null;
    }

  }

  loadJSON( file ) {

    try {
      return require( file );
    } catch ( error ) {
      console.log( error );
      return null;
    }

  }

  yaml2JSON( file ) {

    try {
      return parseJSON( this.loadYAML( file ), null, 2 );
    } catch( error ) {
      console.log( error );
      return null;
    }

  }

  json2YAML( file ) {

    try {
      return parseYAML( this.loadJSON( file ), null, 2 );
    } catch( error ) {
      console.log( error );
      return null;
    }

  }

  writeFile( filePath, content ) {

    if ( ! filePath || ! content ) {
      return null;
    }

    try {
      fs.writeFileSync( filePath, content );
    } catch( error ) {
      console.error( error );
      return null;
    }

  }

  /**
   * Tries to locate a `package.yml` file. If found, converts the contents of the
   * file to JSON and updates `package.json`. If not found, creates `package.yml`
   * by converting the contents of `package.json` to YAML.
   */
  updatePackageFile() {

    // Check for YAML and JSON package files.
    let yamlFile = process.cwd() + '/package.yml';
    let jsonFile = process.cwd() + '/package.json';
    let outputFile;
    let inputString;

    console.log( yamlFile );
    console.log( jsonFile );

    if ( fs.existsSync( yamlFile ) ) {

      // YAML file exists, convert it to JSON.
      this.writeFile( jsonFile, this.yaml2JSON( yamlFile ) );

      console.log( 'Converting `package.yml` to `package.json`' );

    } else if ( fs.existsSync( jsonFile ) ) {

      // No YAML file but a JSON file exists, convert it to YAML.
      this.writeFile( yamlFile, this.json2YAML( jsonFile ) );

      console.log( 'Converting `package.json` to `package.yml`' );

    }

  }

}

new npmYAML();
