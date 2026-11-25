import 'package:json_annotation/json_annotation.dart';

part 'country_detail_locales.g.dart';

/// Country Detail Locales
@JsonSerializable(includeIfNull: false)
class ReferenceCountryDetailLocales {
  const ReferenceCountryDetailLocales({
    this.fromYear,
    required this.languageCode,
    required this.languageId,
    this.languageIso,
    required this.position,
    required this.statusTerm,
    this.toYear,
  });
  final int? fromYear;
  final String languageCode;
  final String languageId;
  final String? languageIso;
  final int position;
  final String statusTerm;
  final int? toYear;

  factory ReferenceCountryDetailLocales.fromJson(Map<String, dynamic> json) => _$ReferenceCountryDetailLocalesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryDetailLocalesToJson(this);
}
