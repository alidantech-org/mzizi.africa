import 'package:json_annotation/json_annotation.dart';

part 'instrument_detail_editions.g.dart';

/// Instrument Detail Editions
@JsonSerializable(includeIfNull: false)
class LegalInstrumentDetailEditions {
  const LegalInstrumentDetailEditions({this.commencedOn, this.consolidatedOn, required this.designation, required this.editionId});
  final DateTime? commencedOn;
  final DateTime? consolidatedOn;
  final String designation;
  final String editionId;

  factory LegalInstrumentDetailEditions.fromJson(Map<String, dynamic> json) => _$LegalInstrumentDetailEditionsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentDetailEditionsToJson(this);
}
