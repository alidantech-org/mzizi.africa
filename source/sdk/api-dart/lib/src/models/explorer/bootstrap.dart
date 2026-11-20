import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/country_choice.dart';
import 'package:mzizi_api/src/models/explorer/language_choice.dart';

part 'bootstrap.g.dart';

/// Bootstrap
@JsonSerializable(includeIfNull: false)
class ExplorerBootstrap {
  const ExplorerBootstrap({required this.countries, required this.gaps, required this.language, required this.languages});
  final List<ExplorerCountryChoice> countries;
  final List<String> gaps;
  final String language;
  final List<ExplorerLanguageChoice> languages;

  factory ExplorerBootstrap.fromJson(Map<String, dynamic> json) => _$ExplorerBootstrapFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerBootstrapToJson(this);
}
