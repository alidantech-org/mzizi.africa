import 'package:json_annotation/json_annotation.dart';

part 'identity_key.g.dart';

/// Identity Key
@JsonSerializable(includeIfNull: false)
class IdentityIdentityKey {
  const IdentityIdentityKey({required this.code});
  final String code;

  factory IdentityIdentityKey.fromJson(Map<String, dynamic> json) => _$IdentityIdentityKeyFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentityKeyToJson(this);
}
