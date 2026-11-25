import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'scopes.g.dart';

/// A deduplicated access scope: global, or narrowed by institution, country, place or field group.
@JsonSerializable(includeIfNull: false)
class AuthScopes {
  const AuthScopes({
    this.countryId,
    required this.createdAt,
    this.featureId,
    this.fieldGroup,
    required this.id,
    required this.includeDescendants,
    this.institutionId,
    required this.isGlobal,
    required this.scopeHash,
  });
  final String? countryId;
  final DateTime createdAt;
  final String? featureId;
  final String? fieldGroup;
  final String id;
  final bool includeDescendants;
  final String? institutionId;
  final bool isGlobal;
  final String scopeHash;

  factory AuthScopes.fromJson(Map<String, dynamic> json) => _$AuthScopesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthScopesToJson(this);
}
