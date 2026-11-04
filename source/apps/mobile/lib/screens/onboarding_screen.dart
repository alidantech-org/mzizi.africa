import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../widgets/cinematic_globe_map.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pages = PageController();
  int _page = 0;

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  void _next() {
    if (_page == 2) {
      widget.onComplete();
      return;
    }
    _pages.nextPage(
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width > 600;
    return Scaffold(
      backgroundColor: AppColors.lightSurface,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Column(
              children: [
                _topBar(),
                Expanded(
                  child: PageView(
                    controller: _pages,
                    onPageChanged: (page) => setState(() => _page = page),
                    children: [
                      _welcomePage(wide),
                      _explorePage(wide),
                      _savePage(wide),
                    ],
                  ),
                ),
                _pageControls(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _topBar() => Padding(
    padding: const EdgeInsets.fromLTRB(22, 10, 16, 0),
    child: Row(
      children: [
        Text(
          'Mzizi.',
          style: TextStyle(
            fontFamily: 'serif',
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: AppColors.primary,
          ),
        ),
        const Spacer(),
        TextButton(onPressed: widget.onComplete, child: const Text('Skip')),
      ],
    ),
  );

  Widget _welcomePage(bool wide) => _pageFrame(
    eyebrow: 'WELCOME TO MZIZI',
    title: 'Understand Kenya.\nBe part of it.',
    description: 'Explore places, public institutions, events and finance records available in Mzizi.',
    art: _welcomeArt(wide),
  );

  Widget _explorePage(bool wide) => _pageFrame(
    eyebrow: 'EXPLORE KENYA',
    title: 'Find the records\nbehind a place.',
    description: 'Search geography, inspect verified boundaries and browse linked governance information.',
    art: _mapArt(wide),
  );

  Widget _savePage(bool wide) => _pageFrame(
    eyebrow: 'KEEP WHAT MATTERS',
    title: 'Stay close to\npublic records.',
    description: 'Browse event and budget records, then save useful items to My Mzizi for this app session.',
    art: _recordsArt(),
  );

  Widget _pageFrame({
    required String eyebrow,
    required String title,
    required String description,
    required Widget art,
  }) => Padding(
    padding: const EdgeInsets.fromLTRB(24, 20, 24, 14),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          eyebrow,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: AppColors.accent,
            fontSize: 11,
            letterSpacing: 1.1,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 9),
        Text(
          title,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: 'serif',
            fontSize: 30,
            height: 1.08,
            fontWeight: FontWeight.w800,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 10),
        ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 390),
          child: Text(
            description,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.lightMuted,
              fontSize: 15,
              height: 1.4,
            ),
          ),
        ),
        const SizedBox(height: 20),
        Expanded(child: Center(child: art)),
      ],
    ),
  );

  Widget _welcomeArt(bool wide) => Container(
    width: double.infinity,
    constraints: BoxConstraints(
      minHeight: wide ? 270 : 250,
      maxHeight: wide ? 310 : 320,
    ),
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(26),
      gradient: const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFFF4E6D3), Color(0xFFE2C4A2)],
      ),
      border: Border.all(color: AppColors.lightBorder),
    ),
    child: Stack(
      alignment: Alignment.center,
      children: [
        Positioned(
          bottom: -55,
          left: -20,
          right: -20,
          child: Container(
            height: 145,
            decoration: BoxDecoration(
              color: AppColors.tan.withValues(alpha: .42),
              borderRadius: const BorderRadius.vertical(
                top: Radius.elliptical(260, 90),
              ),
            ),
          ),
        ),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Mzizi.',
              style: TextStyle(
                fontFamily: 'serif',
                fontSize: 54,
                fontWeight: FontWeight.w900,
                color: AppColors.primary,
                letterSpacing: -2,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _ornament(Icons.account_balance_outlined),
                const SizedBox(width: 12),
                _ornament(Icons.map_outlined),
                const SizedBox(width: 12),
                _ornament(Icons.menu_book_outlined),
              ],
            ),
          ],
        ),
      ],
    ),
  );

  Widget _mapArt(bool wide) => Container(
    width: double.infinity,
    constraints: BoxConstraints(maxHeight: wide ? 300 : 280),
    clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: AppColors.lightBorder),
      color: const Color(0xFFE7DDCF),
    ),
    child: const CinematicGlobeMap(height: 260),
  );

  Widget _recordsArt() => Container(
    width: double.infinity,
    constraints: const BoxConstraints(maxHeight: 340),
    padding: const EdgeInsets.symmetric(horizontal: 24),
    decoration: BoxDecoration(
      color: const Color(0xFFF4E7D7),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: AppColors.lightBorder),
    ),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _recordIllustration(
          icon: Icons.event_note_outlined,
          title: 'Events',
          subtitle: 'Records from Mzizi',
        ),
        const SizedBox(height: 12),
        _recordIllustration(
          icon: Icons.account_balance_wallet_outlined,
          title: 'Budgets',
          subtitle: 'Amounts as recorded',
        ),
        const SizedBox(height: 12),
        _recordIllustration(
          icon: Icons.bookmark_outline,
          title: 'My Mzizi',
          subtitle: 'Saved for this session',
        ),
      ],
    ),
  );

  Widget _recordIllustration({
    required IconData icon,
    required String title,
    required String subtitle,
  }) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
    decoration: BoxDecoration(
      color: AppColors.lightSurface,
      borderRadius: BorderRadius.circular(15),
    ),
    child: Row(
      children: [
        CircleAvatar(
          backgroundColor: const Color(0xFFF0E2D0),
          child: Icon(icon, color: AppColors.primary),
        ),
        const SizedBox(width: 11),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.lightMuted,
                ),
              ),
            ],
          ),
        ),
        const Icon(Icons.check_circle, color: AppColors.lightSuccess),
      ],
    ),
  );

  Widget _ornament(IconData icon) => Container(
    width: 56,
    height: 56,
    decoration: const BoxDecoration(
      color: AppColors.lightSurface,
      shape: BoxShape.circle,
    ),
    child: Icon(icon, color: AppColors.primary, size: 26),
  );

  Widget _pageControls() => Padding(
    padding: const EdgeInsets.fromLTRB(24, 4, 24, 22),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            3,
            (index) => AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: index == _page ? 22 : 7,
              height: 7,
              decoration: BoxDecoration(
                color: index == _page
                    ? AppColors.primary
                    : AppColors.lightBorder,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(height: 15),
        SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: _next,
            child: Text(
              _page == 0
                  ? 'Get Started'
                  : _page == 2
                  ? 'Explore Mzizi'
                  : 'Next',
            ),
          ),
        ),
        if (_page > 0)
          TextButton(
            onPressed: () => _pages.previousPage(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOut,
            ),
            child: const Text('Back'),
          )
        else
          const SizedBox(height: 40),
      ],
    ),
  );
}
