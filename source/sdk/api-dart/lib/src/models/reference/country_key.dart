import 'package:json_annotation/json_annotation.dart';

part 'country_key.g.dart';

/// Country Key
@JsonSerializable(includeIfNull: false)
class ReferenceCountryKey {
  const ReferenceCountryKey({required this.code});
  final String code;

  factory ReferenceCountryKey.fromJson(Map<String, dynamic> json) => _$ReferenceCountryKeyFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryKeyToJson(this);
}
