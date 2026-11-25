import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'locales.g.dart';

/// A language in a country (sw-KE, fr-CD) with its dated status. Drives the language fallback chain, the languages a site offers and number formatting.
@JsonSerializable(includeIfNull: false)
class ReferenceLocales {
  const ReferenceLocales({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.languageId,
    required this.position,
    required this.statusTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String languageId;
  final int position;
  final String statusTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory ReferenceLocales.fromJson(Map<String, dynamic> json) => _$ReferenceLocalesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceLocalesToJson(this);
}
