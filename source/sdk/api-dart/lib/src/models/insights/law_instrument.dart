import 'package:json_annotation/json_annotation.dart';

part 'law_instrument.g.dart';

/// Law Instrument
@JsonSerializable(includeIfNull: false)
class InsightsLawInstrument {
  const InsightsLawInstrument({
    required this.code,
    this.enactedOn,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
    required this.provisions,
  });
  final String code;
  final DateTime? enactedOn;
  final String kindCode;
  final String kindLabel;
  final String name;
  final int provisions;

  factory InsightsLawInstrument.fromJson(Map<String, dynamic> json) => _$InsightsLawInstrumentFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLawInstrumentToJson(this);
}
