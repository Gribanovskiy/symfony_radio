$(function(){
			var camera, scene, renderer;
			var geometry, material, mesh, group;

			var init = function () {

				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 500;
				camera.position.y = 230;
				camera.rotation.x = -0.5;
				
				
				
				scene = new THREE.Scene();
				
				group = new THREE.Object3D();
				
				geometry = new THREE.CubeGeometry( 600, 20, 600 );

				material = new THREE.MeshBasicMaterial( { color: 0xFFF8DC, wireframe: false, wireframeLinewidth: 2 } );
				
				mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );
				
				geometry = new THREE.CubeGeometry( 20, 100, 20 );
				material = new THREE.MeshBasicMaterial( { color: 0x337ab7, wireframe: false, wireframeLinewidth: 2 } );
				mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = 207;
				mesh.position.y = -1;
				group.add( mesh );
				
				geometry = new THREE.CubeGeometry( 20, 100, 20 );
				material = new THREE.MeshBasicMaterial( { color: 0x337ab7, wireframe: false, wireframeLinewidth: 2 } );
				mesh = new THREE.Mesh( geometry, material );
				mesh.position.x = 247;
				mesh.position.y = -1;
				group.add( mesh );
				
				scene.add( group );
			}

			var animate = function () {

				requestAnimationFrame( animate );

				group.rotation.y = Date.now() * 0.0005;
				renderer.render( scene, camera );

			}

			init();
			animate();
	
});