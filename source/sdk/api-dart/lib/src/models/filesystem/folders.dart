import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/filesystem/access.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'folders.g.dart';

/// Logical hierarchy; access escalation requires recorded authorization, independent of object keys.
@JsonSerializable(includeIfNull: false)
class FilesystemFolders {
  const FilesystemFolders({
    required this.access,
    this.authorization,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.name,
    this.parentId,
    required this.roleId,
    required this.updatedAt,
    required this.version,
  });
  final FilesystemAccess access;
  final String? authorization;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String name;
  final String? parentId;
  final String roleId;
  final DateTime updatedAt;
  final int version;

  factory FilesystemFolders.fromJson(Map<String, dynamic> json) => _$FilesystemFoldersFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFoldersToJson(this);
}
