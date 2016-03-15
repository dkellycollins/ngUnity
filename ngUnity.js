var unityObjectUrl = "http://webplayer.unity3d.com/download_webplayer-3.x/3.0/uo/UnityObject2.js";
if (document.location.protocol == 'https:')
   unityObjectUrl = unityObjectUrl.replace("http://", "https://ssl-");
document.write('<script type="text\/javascript" src="' + unityObjectUrl + '"><\/script>');

angular.module('ngUnity', [])
    .provider('unityWebPlayerConfig', [function() {
       var _this = this;

       this.width = 960;
       this.height = 600;
       this.params = {
          enableDebugging: '1',
          disableContextMenu: true
       };

       this.$get = [function() {
          return _this;
       }]
    }])
    .directive('unityWebPlayer', ['unityWebPlayerConfig', function (config) {

       function init(src, $element) {
          var $missingScreen = $element.find('.missing');
          var $brokenScreen = $element.find('.broken');
          $missingScreen.hide();
          $brokenScreen.hide();

          var u = new UnityObject2(config);
          u.observeProgress(function (progress) {
             switch (progress.pluginStatus) {
                case "broken":
                {
                   $brokenScreen.find("a").click(function (e) {
                      e.stopPropagation();
                      e.preventDefault();
                      u.installPlugin();

                      return false;
                   });
                   $brokenScreen.show();
                }
                   break;
                case "missing":
                {
                   $missingScreen.find("a").click(function (e) {
                      e.stopPropagation();
                      e.preventDefault();
                      u.installPlugin();
                      return false;
                   });
                   $missingScreen.show();
                }
                   break;
                case "installed":
                {
                   $missingScreen.remove();
                }
                   break;
                case "first":
                {

                }
                   break;
             }
          });

          u.initPlugin($element, src);
       }

       return {
          restrict: 'EAC',
          link: function ($scope, $element, $attr) {
             $scope.$watch($attr.unityWebPlayer, function(src) {
                if(!src) {
                   return;
                }

                init(src, $element);
             });
          }
       }
    }]);