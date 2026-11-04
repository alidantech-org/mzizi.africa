import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  static const _pageCount = 3;
  final _pages = PageController();
  int _page = 0;

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  void _next() {
    if (_page == _pageCount - 1) {
      widget.onComplete();
      return;
    }
    _pages.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.lightBackground,
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: Column(
            children: [
              Expanded(
                child: PageView(
                  controller: _pages,
                  onPageChanged: (page) => setState(() => _page = page),
                  children: [_welcomePage(), _explorePage(), _updatesPage()],
                ),
              ),
              _dots(),
              _actions(),
            ],
          ),
        ),
      ),
    ),
  );

  // All onboarding pages share centered headings, descriptions and artwork.
  // Feature-list labels remain left-aligned within a centered content column.
  Widget _pageHeading({
    required String title,
    required String subtitle,
    Widget? brand,
  }) => Column(
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      if (brand != null) ...[
        brand,
        const SizedBox(height: 14),
      ],
      Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 26,
          height: 1.15,
          fontWeight: FontWeight.w800,
          color: AppColors.primary,
        ),
      ),
      const SizedBox(height: 12),
      Text(
        subtitle,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 14.5,
          height: 1.4,
          color: AppColors.lightMuted,
        ),
      ),
    ],
  );

  Widget _welcomePage() => Column(
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(28, 40, 28, 0),
        child: SizedBox(
          width: double.infinity,
          child: _pageHeading(
            title: 'Understand Kenya.\nBe part of it.',
            subtitle: 'Your guide to Kenya’s governance, public resources and more.',
            brand: const Text(
              'Mzizi.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'serif',
                fontSize: 52,
                fontWeight: FontWeight.w900,
                color: AppColors.brand,
                letterSpacing: -2,
              ),
            ),
          ),
        ),
      ),
      Expanded(
        child: Semantics(
          image: true,
          label: 'Nairobi skyline',
          child: ShaderMask(
            blendMode: BlendMode.dstIn,
            shaderCallback: (rect) => const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.transparent,
                Colors.black,
                Colors.black,
                Colors.transparent,
              ],
              stops: [0, .22, .78, 1],
            ).createShader(rect),
            child: Image.asset(
              'assets/onboarding/nairobi.jpg',
              width: double.infinity,
              height: double.infinity,
              fit: BoxFit.cover,
              alignment: Alignment.bottomCenter,
            ),
          ),
        ),
      ),
    ],
  );

  Widget _explorePage() => _featurePage(
    title: 'Explore Kenya',
    subtitle:
        'Discover counties, government institutions, and public spending.',
    art: Semantics(
      image: true,
      label: 'Map of Kenya in the colours of the national flag',
      child: const CustomPaint(
        size: Size(150, 190),
        painter: _KenyaFlagMapPainter(),
      ),
    ),
    items: const [
      (Icons.search, 'Find information easily'),
      (Icons.verified_user_outlined, 'Promote transparency'),
      (Icons.groups_outlined, 'Be an informed citizen'),
    ],
  );

  Widget _updatesPage() => _featurePage(
    title: 'Stay in the know',
    subtitle: 'Get updates on governance, projects and news across Kenya.',
    art: Semantics(
      image: true,
      label: 'Phone showing a notification bell',
      child: SizedBox(
        width: 190,
        height: 190,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: 170,
              height: 170,
              decoration: const BoxDecoration(
                color: Color(0xFFEADDC8),
                shape: BoxShape.circle,
              ),
            ),
            Container(
              width: 96,
              height: 160,
              decoration: BoxDecoration(
                color: AppColors.lightSurface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.primary, width: 4),
              ),
              child: const Icon(
                Icons.notifications,
                size: 54,
                color: AppColors.amber,
              ),
            ),
            const Positioned(
              top: 10,
              right: 18,
              child: Icon(Icons.flare, size: 28, color: AppColors.tan),
            ),
          ],
        ),
      ),
    ),
    items: const [
      (Icons.check_circle, 'Personalised updates'),
      (Icons.check_circle, 'Save your interests'),
      (Icons.check_circle, 'Follow institutions'),
    ],
  );

  Widget _featurePage({
    required String title,
    required String subtitle,
    required Widget art,
    required List<(IconData, String)> items,
  }) => LayoutBuilder(
    builder: (context, constraints) => SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(28, 40, 28, 12),
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: constraints.maxHeight - 52),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(
              width: double.infinity,
              child: _pageHeading(title: title, subtitle: subtitle),
            ),
            const SizedBox(height: 26),
            Center(child: art),
            const SizedBox(height: 28),
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 320),
                child: Column(
                  children: [
                    for (final (icon, label) in items)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 9),
                        child: Row(
                          children: [
                            Icon(
                              icon,
                              size: 24,
                              color: icon == Icons.check_circle
                                  ? AppColors.lightSuccess
                                  : AppColors.brand,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                label,
                                style: const TextStyle(
                                  fontSize: 15,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );

  Widget _dots() => Semantics(
    label: 'Onboarding page ${_page + 1} of $_pageCount',
    child: ExcludeSemantics(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _pageCount,
            (i) => AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              margin: const EdgeInsets.symmetric(horizontal: 5),
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: i == _page ? AppColors.primary : AppColors.lightBorder,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ),
      ),
    ),
  );

  Widget _actions() => Padding(
    padding: const EdgeInsets.fromLTRB(28, 0, 28, 10),
    child: Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 52,
          child: FilledButton(
            onPressed: _next,
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.brand,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            child: Text(_page == 0 ? 'Get Started' : 'Next'),
          ),
        ),
        TextButton(
          onPressed: widget.onComplete,
          child: const Text('Skip', style: TextStyle(color: AppColors.primary)),
        ),
      ],
    ),
  );
}

class _KenyaFlagMapPainter extends CustomPainter {
  const _KenyaFlagMapPainter();

  static const _outline = <Offset>[
    Offset(34.0, 4.2),
    Offset(35.9, 4.6),
    Offset(35.9, 5.4),
    Offset(36.9, 4.4),
    Offset(38.1, 3.6),
    Offset(39.0, 3.5),
    Offset(41.0, 3.95),
    Offset(41.9, 3.95),
    Offset(41.0, 2.8),
    Offset(41.0, -0.9),
    Offset(41.5, -1.7),
    Offset(40.9, -2.3),
    Offset(40.1, -3.2),
    Offset(39.7, -4.0),
    Offset(39.2, -4.7),
    Offset(37.6, -3.5),
    Offset(37.7, -3.1),
    Offset(35.0, -1.1),
    Offset(34.0, -1.0),
    Offset(33.9, 0.1),
    Offset(34.1, 0.5),
    Offset(34.5, 1.1),
    Offset(35.0, 1.9),
    Offset(34.5, 3.0),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    const minX = 33.9, maxX = 41.9, minY = -4.7, maxY = 5.4;
    final scale = (size.width / (maxX - minX))
        .clamp(0, size.height / (maxY - minY))
        .toDouble();
    final dx = (size.width - (maxX - minX) * scale) / 2;
    final dy = (size.height - (maxY - minY) * scale) / 2;
    final path = Path();
    for (var i = 0; i < _outline.length; i++) {
      final p = Offset(
        dx + (_outline[i].dx - minX) * scale,
        dy + (maxY - _outline[i].dy) * scale,
      );
      i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
    }
    path.close();
    canvas.save();
    canvas.clipPath(path);
    final h = size.height;
    void band(double a, double b, Color c) => canvas.drawRect(
      Rect.fromLTRB(0, h * a, size.width, h * b),
      Paint()..color = c,
    );
    band(0, .34, Colors.black);
    band(.34, .38, Colors.white);
    band(.38, .62, const Color(0xFFBB0000));
    band(.62, .66, Colors.white);
    band(.66, 1, const Color(0xFF006600));
    final c = Offset(size.width * .48, h * .5);
    final shield = Rect.fromCenter(
      center: c,
      width: size.width * .28,
      height: h * .3,
    );
    canvas.drawOval(shield.inflate(3), Paint()..color = Colors.white);
    canvas.drawOval(shield, Paint()..color = const Color(0xFFBB0000));
    canvas.drawLine(
      Offset(c.dx, shield.top - 6),
      Offset(c.dx, shield.bottom + 6),
      Paint()
        ..color = Colors.black
        ..strokeWidth = 3,
    );
    canvas.restore();
    canvas.drawPath(
      path,
      Paint()
        ..style = PaintingStyle.stroke
        ..color = AppColors.primary.withValues(alpha: .35)
        ..strokeWidth = 1,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
