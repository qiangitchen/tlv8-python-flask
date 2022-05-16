/*  
===============================================================================
WResize is the jQuery plugin for fixing the IE window resize bug
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/
===============================================================================
*/

( function( $ ) 
{
	$.fn.wresize = function( f ) 
	{
		version = '1.1';
		wresize = {fired: false, width: 0};

		function resizeOnce() 
		{
			if ( $.browser.msie )
			{
				if ( ! wresize.fired )
				{
					wresize.fired = true;
				}
				else 
				{
					var version = parseInt( jQuery.browser.version, 10 );
					wresize.fired = false;
					if ( version < 7 )
					{
						return false;
					}
					else if ( version == 7 )
					{
						//a vertical resize is fired once, an horizontal resize twice
						var width = $( window ).width();
						if ( width != wresize.width )
						{
							wresize.width = width;
							return false;
						}
					}
				}
			}

			return true;
		}

		function handleWResize( e ) 
		{
			if ( window._fn_resize_ && resizeOnce() && !window._changing_)
			{
				for (var i in window._fn_resize_)
				{
					if ( window._fn_resize_[i] ) {
						window._fn_resize_[i].apply(this, [e]);
					}
				}
			}
		}

		this.each( function() 
		{
			if ( !f )
			{
				if (window._changing_) return;
				$( this ).resize();
			}
			else if ( this == window )
			{
				if (!window._fn_resize_) window._fn_resize_ = [];
				for (var i in window._fn_resize_)
				{
					if (window._fn_resize_[i] == f)
					{
						return;
					}
				}
				window._fn_resize_[window._fn_resize_.length] = f;
				if (window._fn_resize_.length == 1)
				{
					$( this ).resize( handleWResize );
				}
			}
			else
			{
				$( this ).resize( f );
			}
		} );

		return this;
	};

} ) ( jQuery );
