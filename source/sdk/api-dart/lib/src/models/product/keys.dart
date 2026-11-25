import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/product/apps.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'keys.g.dart';

/// An interface text key declared in contracts; unknown keys are refused and missing messages are gaps.
@JsonSerializable(includeIfNull: false)
class ProductKeys {
  const ProductKeys({
    this.appId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    this.maxLength,
    this.placeholders,
    required this.updatedAt,
    required this.version,
  });
  final String? appId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final int? maxLength;
  final List<String>? placeholders;
  final DateTime updatedAt;
  final int version;

  factory ProductKeys.fromJson(Map<String, dynamic> json) => _$ProductKeysFromJson(json);

  Map<String, dynamic> toJson() => _$ProductKeysToJson(this);
}
