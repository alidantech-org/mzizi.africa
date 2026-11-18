import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/icons_generated.dart';

/// The Mzizi icon set (the same 24-pixel stroke icons as the website), tinted with the current text colour so it follows
/// light and dark mode. Generated paths live in `icons_generated.dart`; the source is `source/sdk/ui/brand/icons.json`.
class MzIcon extends StatelessWidget {
  const MzIcon(
    this.name, {
    super.key,
    this.size = 22,
    this.color,
    this.semanticLabel,
  });

  final String name;
  final double size;
  final Color? color;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final tint =
        color ??
        IconTheme.of(context).color ??
        Theme.of(context).colorScheme.onSurface;
    final inner = mzIconPaths[name] ?? mzIconPaths['info']!;
    return SvgPicture.string(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">$inner</svg>',
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(tint, BlendMode.srcIn),
      semanticsLabel: semanticLabel,
    );
  }
}
