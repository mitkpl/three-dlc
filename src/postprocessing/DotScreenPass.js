import { Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, UniformsUtils } from 'three';
import DotScreenShader from '../shaders/DotScreenShader';
import Pass from './Pass';

/**
 * @author alteredq / http://alteredqualia.com/
 */

const DotScreenPass = function ( center, angle, scale ) {

	Pass.call( this );

	if ( DotScreenShader === undefined )
		console.error( "DotScreenPass relies on DotScreenShader" );

	var shader = DotScreenShader;

	this.uniforms = UniformsUtils.clone( shader.uniforms );

	if ( center !== undefined ) this.uniforms[ "center" ].value.copy( center );
	if ( angle !== undefined ) this.uniforms[ "angle" ].value = angle;
	if ( scale !== undefined ) this.uniforms[ "scale" ].value = scale;

	this.material = new ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.camera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new Scene();

	this.quad = new Mesh( new PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

DotScreenPass.prototype = Object.assign( Object.create( Pass.prototype ), {

	constructor: DotScreenPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.uniforms[ "tSize" ].value.set( readBuffer.width, readBuffer.height );

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );


export default DotScreenPass;
