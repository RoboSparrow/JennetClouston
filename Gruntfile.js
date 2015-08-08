module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', '*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: false,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask(
    'default', 
    'hint', 
    ['jshint']
  );

};
