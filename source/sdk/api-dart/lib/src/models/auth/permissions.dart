import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/auth/auth_action.dart';
import 'package:mzizi_api/src/enums/auth/resource_type.dart';
import 'package:mzizi_api/src/models/shared/coded_identified.dart';

part 'permissions.g.dart';

/// A named action on a resource type, optionally narrowed to a field group.
@JsonSerializable(includeIfNull: false)
class AuthPermissions {
  const AuthPermissions({
    required this.action,
    required this.code,
    this.description,
    this.fieldGroup,
    required this.id,
    required this.isActive,
    required this.resourceType,
  });
  final AuthAuthAction action;
  final String code;
  final String? description;
  final String? fieldGroup;
  final String id;
  final bool isActive;
  final AuthResourceType resourceType;

  factory AuthPermissions.fromJson(Map<String, dynamic> json) => _$AuthPermissionsFromJson(json);

  Map<String, dynamic> toJson() => _$AuthPermissionsToJson(this);
}
