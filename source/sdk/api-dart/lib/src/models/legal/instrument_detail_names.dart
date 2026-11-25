import 'package:json_annotation/json_annotation.dart';

part 'instrument_detail_names.g.dart';

/// Instrument Detail Names
@JsonSerializable(includeIfNull: false)
class LegalInstrumentDetailNames {
  const LegalInstrumentDetailNames({
    this.fromYear,
    required this.isDefault,
    required this.kindTerm,
    required this.languageCode,
    this.languageIso,
    required this.text,
    this.toYear,
  });
  final int? fromYear;
  final bool isDefault;
  final String kindTerm;
  final String languageCode;
  final String? languageIso;
  final String text;
  final int? toYear;

  factory LegalInstrumentDetailNames.fromJson(Map<String, dynamic> json) => _$LegalInstrumentDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentDetailNamesToJson(this);
}
