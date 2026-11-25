import 'package:json_annotation/json_annotation.dart';

part 'instrument_key.g.dart';

/// Instrument Key
@JsonSerializable(includeIfNull: false)
class LegalInstrumentKey {
  const LegalInstrumentKey({required this.code});
  final String code;

  factory LegalInstrumentKey.fromJson(Map<String, dynamic> json) => _$LegalInstrumentKeyFromJson(json);

  Map<String, dynamic> toJson() => _$LegalInstrumentKeyToJson(this);
}
