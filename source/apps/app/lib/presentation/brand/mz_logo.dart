import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:material_ui/material_ui.dart';

const _mark = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8582B"/><stop offset="1" stop-color="#D9A13D"/></linearGradient></defs><rect width="48" height="48" rx="13" fill="url(#g)"/><g fill="none" stroke="#FFFAF0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 33.5V19.5L24 29l10.5-9.5v14"/><path d="M24 29v11.5M24 36l-5 4M24 36l5 4"/></g><circle cx="24" cy="11.8" r="3.1" fill="#FFFAF0"/></svg>''';

/// The Mzizi mark: a root system drawn as an M under a seedling, on a clay-to-gold tile.
class MzLogoMark extends StatelessWidget {
  const MzLogoMark({super.key, this.size = 36});
  final double size;
  @override
  Widget build(BuildContext context) => SvgPicture.string(_mark, width: size, height: size, semanticsLabel: 'Mzizi');
}

/// The mark and the word Mzizi, set in Fraunces.
class MzLogo extends StatelessWidget {
  const MzLogo({super.key, this.size = 34, this.showText = true});
  final double size;
  final bool showText;
  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      MzLogoMark(size: size),
      if (showText) ...[
        const SizedBox(width: 10),
        Text('Mzizi', style: GoogleFonts.fraunces(fontSize: size * 0.78, fontWeight: FontWeight.w600, letterSpacing: -0.5, color: Theme.of(context).colorScheme.onSurface)),
      ],
    ],
  );
}
