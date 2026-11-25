import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instrument_entry_names.dart';

part 'instrument_entry.g.dart';

/// Instrument Entry
@JsonSerializable(includeIfNull: false)
class LegalInstrumentEntry {
  const LegalInstrumentEntry({
    required this.code,
    this.enactedOn,
    this.fromYear,
    required this.instrumentId,
    required this.kindTerm,
    required this.names,
    this.statusTerm,
  });
  final String code;
  final DateTime? enactedOn;
  final int? fromYear;
  final String instrumentId;
  final String kindTerm;
  final List<LegalInstrumentEntryNames> names;
  final String? statusTerm;

  factory LegalInstrumentEntry.fromJson(Map<String, dynamic> json) => _$LegalInstrumentEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentEntryToJson(this);
}
