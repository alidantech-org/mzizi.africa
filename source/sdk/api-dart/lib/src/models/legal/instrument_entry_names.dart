import 'package:json_annotation/json_annotation.dart';

part 'instrument_entry_names.g.dart';

/// Instrument Entry Names
@JsonSerializable(includeIfNull: false)
class LegalInstrumentEntryNames {
  const LegalInstrumentEntryNames({
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

  factory LegalInstrumentEntryNames.fromJson(Map<String, dynamic> json) => _$LegalInstrumentEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentEntryNamesToJson(this);
}
