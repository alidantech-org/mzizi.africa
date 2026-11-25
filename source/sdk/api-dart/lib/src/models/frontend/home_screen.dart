import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/country_link.dart';
import 'package:mzizi_api/src/models/frontend/language_option.dart';

part 'home_screen.g.dart';

/// Home Screen
@JsonSerializable(includeIfNull: false)
class FrontendHomeScreen {
  const FrontendHomeScreen({required this.countries, required this.language, required this.languages});
  final List<FrontendCountryLink> countries;
  final String language;
  final List<FrontendLanguageOption> languages;

  factory FrontendHomeScreen.fromJson(Map<String, dynamic> json) => _$FrontendHomeScreenFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendHomeScreenToJson(this);
}
