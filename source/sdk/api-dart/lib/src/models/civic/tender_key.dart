import 'package:json_annotation/json_annotation.dart';

part 'tender_key.g.dart';

/// Tender Key
@JsonSerializable(includeIfNull: false)
class CivicTenderKey {
  const CivicTenderKey({required this.code});
  final String code;

  factory CivicTenderKey.fromJson(Map<String, dynamic> json) => _$CivicTenderKeyFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderKeyToJson(this);
}
