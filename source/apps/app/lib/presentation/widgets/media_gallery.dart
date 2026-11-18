import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/core/theme/mzizi_theme.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';

/// A picture to show: its address and an optional caption.
typedef MediaItem = ({String url, String? caption});

bool _isSvg(String url) =>
    url.toLowerCase().contains('.svg') ||
    url.contains('/svg?') ||
    url.contains('/svg/');

/// A network picture that also draws SVG (generated portraits are SVG), fades in and falls back to a tinted tile with
/// a picture icon, never to an error box.
class NetImage extends StatelessWidget {
  const NetImage(
    this.url, {
    super.key,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
  });
  final String url;
  final BoxFit fit;
  final double? width, height;

  Widget _fallback(BuildContext context) => Container(
    width: width,
    height: height,
    color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
    child: Center(
      child: MzIcon(
        'image',
        size: 28,
        color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.6),
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return _fallback(context);
    if (_isSvg(url)) {
      return SvgPicture.network(
        url,
        width: width,
        height: height,
        fit: fit,
        placeholderBuilder: (_) => _fallback(context),
        errorBuilder: (context, error, stack) => _fallback(context),
      );
    }
    return Image.network(
      url,
      width: width,
      height: height,
      fit: fit,
      frameBuilder: (context, child, frame, sync) => AnimatedOpacity(
        opacity: frame == null && !sync ? 0 : 1,
        duration: const Duration(milliseconds: 350),
        child: child,
      ),
      errorBuilder: (context, _, _) => _fallback(context),
    );
  }
}

/// A round portrait with initials underneath, for people.
class Portrait extends StatelessWidget {
  const Portrait({super.key, required this.name, this.url, this.size = 64});
  final String name;
  final String? url;
  final double size;
  @override
  Widget build(BuildContext context) {
    final initials = name
        .split(' ')
        .where((w) => w.isNotEmpty)
        .map((w) => w[0])
        .take(2)
        .join();
    return SizedBox(
      width: size,
      height: size,
      child: ClipOval(
        child: Stack(
          fit: StackFit.expand,
          children: [
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [MziziTokens.clay, MziziTokens.calabash],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                initials,
                style: TextStyle(
                  color: MziziTokens.cream,
                  fontSize: size * 0.36,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            if (url != null && url!.isNotEmpty) NetImage(url!),
          ],
        ),
      ),
    );
  }
}

/// A full-bleed picture with a dark gradient at the bottom for text over it.
class HeroImage extends StatelessWidget {
  const HeroImage({
    super.key,
    this.url,
    this.height = 220,
    this.child,
    this.radius = 24,
  });
  final String? url;
  final double height;
  final double radius;
  final Widget? child;
  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(radius),
    child: SizedBox(
      height: height,
      width: double.infinity,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [MziziTokens.clay, MziziTokens.indigo],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          if (url != null && url!.isNotEmpty) NetImage(url!),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.transparent, Color(0xB3000000)],
                begin: Alignment.center,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          if (child != null)
            Positioned(
              left: 16,
              right: 16,
              bottom: 14,
              child: DefaultTextStyle.merge(
                style: const TextStyle(color: Colors.white),
                child: child!,
              ),
            ),
        ],
      ),
    ),
  );
}

/// A swipeable row of pictures with a parallax shift, dots and captions. Tap one to open the full-screen gallery.
class ImageCarousel extends StatefulWidget {
  const ImageCarousel({super.key, required this.items, this.height = 220});
  final List<MediaItem> items;
  final double height;
  @override
  State<ImageCarousel> createState() => _ImageCarouselState();
}

class _ImageCarouselState extends State<ImageCarousel> {
  late final PageController _page = PageController(viewportFraction: 0.9);
  double _pos = 0;
  @override
  void initState() {
    super.initState();
    _page.addListener(() => setState(() => _pos = _page.page ?? 0));
  }

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final items = widget.items;
    if (items.isEmpty) return const SizedBox.shrink();
    return Column(
      children: [
        SizedBox(
          height: widget.height,
          child: PageView.builder(
            controller: _page,
            itemCount: items.length,
            itemBuilder: (context, i) {
              final delta = (_pos - i).clamp(-1.0, 1.0);
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5),
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.selectionClick();
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        fullscreenDialog: true,
                        builder: (_) => GalleryPage(items: items, start: i),
                      ),
                    );
                  },
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(22),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Transform.translate(
                          offset: Offset(delta * -28, 0),
                          child: Transform.scale(
                            scale: 1.18,
                            child: NetImage(items[i].url),
                          ),
                        ),
                        const DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Colors.transparent, Color(0x99000000)],
                              begin: Alignment.center,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                        ),
                        if ((items[i].caption ?? '').isNotEmpty)
                          Positioned(
                            left: 14,
                            right: 14,
                            bottom: 12,
                            child: Text(
                              items[i].caption!,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        if (items.length > 1)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (var i = 0; i < items.length; i++)
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: (_pos.round() == i) ? 18 : 6,
                    height: 6,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      color: Theme.of(context).colorScheme.primary.withValues(
                        alpha: _pos.round() == i ? 1 : 0.3,
                      ),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

/// Full-screen pictures with pinch-to-zoom; swipe sideways between them, tap the close button to leave.
class GalleryPage extends StatefulWidget {
  const GalleryPage({super.key, required this.items, this.start = 0});
  final List<MediaItem> items;
  final int start;
  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  late int _i = widget.items.isEmpty
      ? 0
      : widget.start.clamp(0, widget.items.length - 1);
  late final PageController _c = PageController(initialPage: _i);
  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.black,
    body: Stack(
      children: [
        if (widget.items.isEmpty)
          Center(
            child: Tx(
              'No images are recorded yet.',
              style: const TextStyle(color: Colors.white),
            ),
          )
        else
          PageView.builder(
            controller: _c,
            itemCount: widget.items.length,
            onPageChanged: (i) => setState(() => _i = i),
            itemBuilder: (context, i) => InteractiveViewer(
              minScale: 1,
              maxScale: 5,
              child: Center(
                child: NetImage(widget.items[i].url, fit: BoxFit.contain),
              ),
            ),
          ),
        SafeArea(
          child: Align(
            alignment: Alignment.topRight,
            child: IconButton(
              tooltip: t(context, 'Close gallery'),
              icon: MzIcon('close', color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
        ),
        if (widget.items.isNotEmpty)
          Positioned(
            left: 20,
            right: 20,
            bottom: 28,
            child: SafeArea(
              child: Text(
                '${_i + 1}/${widget.items.length}${(widget.items[_i].caption ?? '').isEmpty ? '' : ' · ${widget.items[_i].caption}'}',
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ),
      ],
    ),
  );
}
