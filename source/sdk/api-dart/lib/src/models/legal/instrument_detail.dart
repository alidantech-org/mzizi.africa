import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instrument_detail_editions.dart';
import 'package:mzizi_api/src/models/legal/instrument_detail_names.dart';

part 'instrument_detail.g.dart';

/// Instrument Detail
@JsonSerializable(includeIfNull: false)
class LegalInstrumentDetail {
  const LegalInstrumentDetail({
    required this.code,
    required this.editions,
    this.enactedOn,
    required this.instrumentId,
    this.issuerId,
    required this.kindTerm,
    required this.names,
    this.publishedOn,
    this.statusTerm,
  });
  final String code;
  final List<LegalInstrumentDetailEditions> editions;
  final DateTime? enactedOn;
  final String instrumentId;
  final String? issuerId;
  final String kindTerm;
  final List<LegalInstrumentDetailNames> names;
  final DateTime? publishedOn;
  final String? statusTerm;

  factory LegalInstrumentDetail.fromJson(Map<String, dynamic> json) => _$LegalInstrumentDetailFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentDetailToJson(this);
}
