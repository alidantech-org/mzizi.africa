import 'package:flutter/foundation.dart';

/// Preview content used by screens whose backend lists are not available yet.
/// It holds names and categories only; figures stay unset until the API
/// supplies sourced values.
class PreviewCounty {
  const PreviewCounty(this.name, this.descriptor, this.asset);
  final String name;
  final String descriptor;
  final String asset;
}

class PreviewInstitution {
  const PreviewInstitution(this.id, this.name, this.type, this.summary);
  final String id;
  final String name;
  final String type;
  final String summary;
}

abstract final class PreviewContent {
  static const counties = [
    PreviewCounty('Nairobi', 'Capital County', 'assets/onboarding/nairobi.jpg'),
    PreviewCounty('Mombasa', 'Coastal County', 'assets/onboarding/mombasa.jpg'),
    PreviewCounty('Kisumu', 'Lake Region', 'assets/onboarding/kisumu.jpg'),
    PreviewCounty('Nakuru', 'Rift Valley', 'assets/onboarding/nakuru.jpg'),
  ];

  static const institutions = [
    PreviewInstitution(
      'health',
      'Ministry of Health',
      'National Government',
      'Leads the health sector in Kenya.',
    ),
    PreviewInstitution(
      'treasury',
      'The National Treasury',
      'National Government',
      'Manages national public finances.',
    ),
    PreviewInstitution(
      'parliament',
      'Parliament of Kenya',
      'Legislature',
      'Makes national laws and oversees public spending.',
    ),
    PreviewInstitution(
      'judiciary',
      'The Judiciary',
      'Judiciary',
      'Interprets the law and administers justice.',
    ),
  ];

  static final followed = ValueNotifier<Set<String>>(<String>{});

  static void toggleFollow(String id) {
    final next = {...followed.value};
    next.contains(id) ? next.remove(id) : next.add(id);
    followed.value = next;
  }
}
