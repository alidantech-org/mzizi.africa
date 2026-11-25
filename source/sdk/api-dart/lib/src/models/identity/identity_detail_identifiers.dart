import 'package:json_annotation/json_annotation.dart';

part 'identity_detail_identifiers.g.dart';

/// Identity Detail Identifiers
@JsonSerializable(includeIfNull: false)
class IdentityIdentityDetailIdentifiers {
  const IdentityIdentityDetailIdentifiers({this.namespace, required this.schemeTerm, required this.value});
  final String? namespace;
  final String schemeTerm;
  final String value;

  factory IdentityIdentityDetailIdentifiers.fromJson(Map<String, dynamic> json) => _$IdentityIdentityDetailIdentifiersFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentityDetailIdentifiersToJson(this);
}
