import 'package:json_annotation/json_annotation.dart';

part 'party_key.g.dart';

/// Party Key
@JsonSerializable(includeIfNull: false)
class PoliticsPartyKey {
  const PoliticsPartyKey({required this.code});
  final String code;

  factory PoliticsPartyKey.fromJson(Map<String, dynamic> json) => _$PoliticsPartyKeyFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyKeyToJson(this);
}
