import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/product/message_entry.dart';

part 'message_collection.g.dart';

/// Message Collection
@JsonSerializable(includeIfNull: false)
class ProductMessageCollection {
  const ProductMessageCollection({required this.messages});
  final List<ProductMessageEntry> messages;

  factory ProductMessageCollection.fromJson(Map<String, dynamic> json) => _$ProductMessageCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ProductMessageCollectionToJson(this);
}
