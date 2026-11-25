import 'package:json_annotation/json_annotation.dart';

part 'bill_key.g.dart';

/// Bill Key
@JsonSerializable(includeIfNull: false)
class LegislatureBillKey {
  const LegislatureBillKey({required this.code});
  final String code;

  factory LegislatureBillKey.fromJson(Map<String, dynamic> json) => _$LegislatureBillKeyFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillKeyToJson(this);
}
